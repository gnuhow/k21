# Dev and Deploy VM Setup Instructions

# I used a VM to test building containers and such.
# RHEL 9 Host VM in VirtualBox
project_name=k21
project_name_lower=k21

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

## local terraform import
az login
cd terraform

subscription_id=$(az account show | jq -r '.id')
tenant_id=$(az account show | jq -r '.tenantId')
ACR_URL="k21registry.azurecr.io"

terraform init -backend-config=storage_account_name=k21devops -backend-config=container_name=tfstate -backend-config=key=terraform.tfstate -backend-config=resource_group_name=k21 -backend-config=subscription_id=${subscription_id} -backend-config=tenant_id=${tenant_id}
terraform import -var acr_url=${ACR_URL} -var app_version=v0.0.2 -var subscription_id=$subscription_id azurerm_container_app.app "/subscriptions/${subscription_id}/resourceGroups/k21-app/providers/Microsoft.App/containerApps/k21project"

terraform plan -out main.tfplan -var acr_url=${ACR_URL} -var app_version=v0.0.2 -var subscription_id=$subscription_id -detailed-exitcode
terraform apply main.tfplan



# run node app local
sudo node container/app.js
curl http://localhost:80


# use buildah for making container images, with rootless support
# use podman to run container images
dnf install -y buildah podman
setsebool -P container_manage_cgroup 1

firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=8080/tcp
semanage port -a -t http_port_t -p tcp 8080

# run images locally for testing
cd container/app
version=1.01

buildah build -t "$project_name:$version" . # --format=docker 
podman run --rm -p 8080:8080 -it "localhost/$project_name:$version"  ash     # live terminal
podman run --rm -d -p 8080:8080 "localhost/$project_name:$version"           # background mode

podman rm --all     # cleanup stoped containers
podman image prune  # cleanu unused images

