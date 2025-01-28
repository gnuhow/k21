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
  subscription_id = var.subscription_id
  features {}
}


variable "subscription_id" {

}


variable "project_name" {
  type = string
  default = "k21"
}


variable "azure_region" {
  type = string
  default = "US Central"
}


resource "azurerm_resource_group" "test" {
  name     = join("-", [var.project_name, "test"])
  location = var.azure_region

  tags = {
    project = "k21"
  }
}