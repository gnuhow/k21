terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.16.0"
    }
  }
}


variable "subscription_id" {}


provider "azurerm" {
  resource_provider_registrations = "none"
  subscription_id = var.subscription_id
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


resource "azurerm_resource_group" "test" {
  name     = join("-", [var.project_name, "test"])
  location = var.azure_region

  tags = {
    project = "k21"
  }
}
