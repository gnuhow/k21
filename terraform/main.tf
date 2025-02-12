terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.16.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "k21"
    storage_account_name = "k21devops"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}


provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}


variable "subscription_id" {
  type = string
}


variable "azure_region" {
  type    = string
  default = "centralus"
}


variable "project_name" {
  type    = string
  default = "k21"
}


variable "project_name_long" {
  type    = string
  default = "k21project"
}


variable "acr_url" {
  type = string
}


variable "app_version" {
  type = string
}


variable "my_cidr" {
  type = string
}

resource "azurerm_resource_group" "app" {
  name     = join("-", [var.project_name, "app"])
  location = var.azure_region

  tags = {
    project = var.project_name
  }
}


resource "azurerm_user_assigned_identity" "app" {
  name                = var.project_name_long
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.app.name
}


resource "azurerm_role_definition" "app" {
  name        = var.project_name_long
  scope       = join("", ["/subscriptions/", var.subscription_id])
  description = "Used by the k21 container app"

  permissions {
    actions = [
      "Microsoft.ContainerRegistry/registries/pull/read",
      "Microsoft.ContainerRegistry/operations/read",
      "Microsoft.ContainerRegistry/locations/operationResults/read",
      "Microsoft.ContainerRegistry/registries/read",
      "Microsoft.ContainerRegistry/registries/packages/archives/read",
      "Microsoft.ContainerRegistry/registries/packages/archives/versions/read",
      "Microsoft.ContainerRegistry/registries/push/write",
      "Microsoft.ContainerRegistry/registries/runs/read",
      "Microsoft.ContainerRegistry/registries/taskruns/read",
      "Microsoft.ContainerRegistry/registries/tasks/read",
      "Microsoft.ContainerRegistry/registries/taskruns/operationStatuses/read"
    ]
    not_actions = []
  }

  assignable_scopes = [
    azurerm_resource_group.app.id # scoped to resource group
    # join("", ["/subscriptions/", var.subscription_id])
  ]
}


resource "azurerm_role_assignment" "app" {
  scope              = azurerm_resource_group.app.id
  role_definition_id = azurerm_role_definition.app.role_definition_resource_id
  principal_id       = azurerm_user_assigned_identity.app.principal_id
}


resource "azurerm_container_registry" "acr" {
  name                          = join("", [var.project_name, "Registry"])
  resource_group_name           = azurerm_resource_group.app.name
  location                      = var.azure_region
  sku                           = "Basic"
  admin_enabled                 = false
  public_network_access_enabled = true # only public access supported with basic plan
  anonymous_pull_enabled        = false

  tags = {
    project = var.project_name
  }
}


resource "azurerm_log_analytics_workspace" "app" {
  name                = join("", [var.project_name, "workspace"])
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.app.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    project = var.project_name
  }
}


resource "azurerm_container_app_environment" "app" {
  name                       = var.project_name_long
  location                   = var.azure_region
  resource_group_name        = azurerm_resource_group.app.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.app.id

  tags = {
    project = var.project_name
  }
}


resource "azurerm_virtual_network" "app" {
  name = ""
  location = var.azure_region
  resource_group_name = azurerm_resource_group.app
  address_space = ["10.0.0.0/16"]
  
  subnet {
    name = "subnet1"
    address_prefixes = ["10.0.1.0/24"]
  }

  subnet {
    name = "subnet2"
    address_prefixes = ["10.0.2.0/24"]
  }


  tags = {
    project = var.project_name
  }
}


resource "azurerm_storage_account" "app" {
  name                     = join("", [var.project_name, "filestorage"])
  resource_group_name      = azurerm_resource_group.app.name
  location                 = var.azure_region
  account_tier             = "Premium"
  account_replication_type = "LRS"
  access_tier = "Hot"
  account_kind = "FileStorage"

  tags = {
    project = var.project_name
  }
}


resource "azurerm_storage_share" "app" {
  name               = var.project_name_long
  storage_account_id = azurerm_storage_account.app.id
  quota              = 100  # GB of storage size
  enabled_protocol = "NFS"
  # access_tier = "Hot"
}


resource "azurerm_container_app" "app" {
  name                         = join("", [var.project_name, "app"])
  resource_group_name          = azurerm_resource_group.app.name
  container_app_environment_id = azurerm_container_app_environment.app.id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app.id]
  }

  registry {
    identity = azurerm_user_assigned_identity.app.id
    server   = var.acr_url
  }

  template {
    max_replicas = 1
    min_replicas = 0

    container {
      name   = "app"
      image  = join("", [var.acr_url, "/app", ":", var.app_version])
      cpu    = 0.5
      memory = "1Gi"
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled = true
    target_port                = 6000
    transport                  = "http"

    traffic_weight {
      label           = "app"
      latest_revision = true
      percentage      = 100
    }

    ip_security_restriction {
      name             = "allowDevUser"
      action           = "Allow"
      description      = "Allow traffic from my location."
      ip_address_range = var.my_cidr
    }
  }

  tags = {
    project = var.project_name
  }
}


resource "azurerm_container_app" "web" {
  name                         = join("", [var.project_name, "web"])
  resource_group_name          = azurerm_resource_group.app.name
  container_app_environment_id = azurerm_container_app_environment.app.id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app.id]
  }

  registry {
    identity = azurerm_user_assigned_identity.app.id
    server   = var.acr_url
  }

  template {
    max_replicas = 1
    min_replicas = 0

    container {
      name   = "web"
      image  = join("", [var.acr_url, "/web", ":", var.app_version])
      cpu    = 0.5
      memory = "1Gi"

      env {
        name = "APP_URL"
        value = join("", ["https://", azurerm_container_app.app.latest_revision_fqdn])
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 7000
    transport                  = "http"

    traffic_weight {
      label           = "web"
      latest_revision = true
      percentage      = 100
    }

    ip_security_restriction {
      name             = "allowDevUser"
      action           = "Allow"
      description      = "Allow traffic from my location."
      ip_address_range = var.my_cidr
    }
  }

  tags = {
    project = var.project_name
  }
}
