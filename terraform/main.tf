terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.16.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
  }
}


variable "azure_subscription_id" {
  type = string
}


variable "azure_tenant_id" {
  type = string
}


provider "azurerm" {
  # resource_provider_registrations = "extended"
  # subscription_id = var.azure_subscription_id
  # tenant_id = var.azure_tenant_id
  features {}
}


variable "azure_region" {
  type = string
  default = "centralus"
}


variable "project_name" {
  type = string
  default = "k21"
}


resource "azurerm_resource_group" "app" {
  name     = join("-", [var.project_name, "app"])
  location = var.azure_region

  tags = {
    project = var.project_name
  }
}


# resource "azurerm_container_registry" "acr" {
#   name                = join("", [var.project_name, "Registry"])
#   resource_group_name = azurerm_resource_group.app.name
#   location            = var.azure_region
#   sku                 = "Basic"
#   admin_enabled       = false
#   public_network_access_enabled = true    # only public access supported with basic plan
#   anonymous_pull_enabled = false

#   tags = {
#     project = var.project_name
#   }
# }