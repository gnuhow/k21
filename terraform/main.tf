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


resource "azurerm_container_registry" "acr" {
  name                = join("", [var.project_name, "Registry"])
  resource_group_name = azurerm_resource_group.app.name
  location            = var.azure_region
  sku                 = "Basic"
  admin_enabled       = false
  public_network_access_enabled = true    # only public access supported with basic plan
  anonymous_pull_enabled = false

  depends_on = [ azurerm_resource_group.app ]
  tags = {
    project = var.project_name
  }
}
