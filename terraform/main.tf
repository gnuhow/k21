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


resource "azurerm_resource_group" "app" {
  name     = join("-", [var.project_name, "app"])
  location = var.azure_region

  tags = {
    project = var.project_name
  }
}


resource azurerm_user_assigned_identity "app" {
  name     = var.project_name_long
  location = var.azure_region
  resource_group_name  = azurerm_resource_group.app.name
}


resource "azurerm_role_definition" "app" {
  name        = var.project_name_long
  scope       = join("", ["/subscriptions/", var.subscription_id])
  description = "Used by the k21 container app"

  permissions {
    actions     = [
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
    join("", ["/subscriptions/", var.subscription_id])
  ]
}


resource "azurerm_container_registry" "acr" {
  name                          = join("", [var.project_name, "Registry"])
  resource_group_name           = azurerm_resource_group.app.name
  location                      = var.azure_region
  sku                           = "Basic"
  admin_enabled                 = false
  public_network_access_enabled = true    # only public access supported with basic plan
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


# resource "azurerm_container_app" "app" {
#   name                         = var.project_name_long
#   resource_group_name          = azurerm_resource_group.app.name
#   container_app_environment_id = azurerm_container_app_environment.app.id
#   revision_mode                = "Single"
  
#   identity {
#     type = "UserAssigned"
#     identity_ids = [azurerm_user_assigned_identity.app.id ]
#   }

#   registry {
#     identity = azurerm_user_assigned_identity.app.id
#     server   = var.acr_url
#   }
  
#   template {
#     container {
#       name   = var.project_name
#       image  = join("", [var.acr_url,"/app",":",var.app_version])
#       cpu    = 0.5
#       memory = "1Gi"
#     }
#   }

#   tags = {
#     project = var.project_name
#   }
# }
