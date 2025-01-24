terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.16.0"
    }
  }
}


provider "azurerm" {
  resource_provider_registrations = "none"
  features {}
}


resource "azurerm_resource_group" "test" {
  name     = "k21-test"
  location = "US East"

  tags = {
    project = "k21"
  }
}