resource "azurerm_resource_group" "test" {
  name     = "k21-test"
  location = "US East"

  tags = {
    project = "k21"
  }
}