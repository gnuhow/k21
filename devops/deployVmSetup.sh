# Deploy VM Setup Instructions

# Azure DevOps won't give me access to a runner, and I don't want to deal with going over on Github Actions minutes. 
# So, I decided to use a deployment host instead.
# RHEL 9 Host VM in VirtualBox
project_name=k21

# Install Azure CLI
# https://developer.hashicorp.com/terraform/tutorials/azure-get-started/azure-build
sudo -i
rpm --import https://packages.microsoft.com/keys/microsoft.asc
dnf install https://packages.microsoft.com/config/rhel/9.0/packages-microsoft-prod.rpm
dnf install azure-cli
az version | jq


## create a service principal
exit
login_info=$(az login)
subscription_id=$(az account show | jq -r '.id')
az account set --subscription "$subscription_id"
service_principal_info=$(az ad sp create-for-rbac --display-name "${project_name}-terraform" --role="Contributor" --scopes="/subscriptions/${subscription_id}" --output json)

sudo echo "export ARM_CLIENT_ID=$(echo $service_principal_info | jq -r .appId)" >> /etc/profile.d/azure.sh
sudo echo "export ARM_CLIENT_SECRET=$(echo $service_principal_info | jq -r .password)" >> /etc/profile.d/azure.sh
sudo echo "export ARM_SUBSCRIPTION_ID=$(echo $subscription_id)" >> /etc/profile.d/azure.sh
sudo echo "export ARM_TENANT_ID=$(echo $service_principal_info | jq -r .tenant)" >> /etc/profile.d/azure.sh

## tf deploy
az login

