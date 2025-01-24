# Azure DevOps Setup steps
- Create a private project in azure devops.
- Put in a request for a free runner/ parallel.
    - https://aka.ms/azpipelines-parallelism-request
    - this can take up to 3 days.

- Create an Azure Resource group, or use the ARM template
- Configure an Azure Resource Manager workload identity service connection
    - https://learn.microsoft.com/en-us/azure/devops/pipelines/release/configure-workload-identity?view=azure-devops&tabs=app-registration
        - Under subscription > IAM, create an RBAC role in Azure. this role should have the deploy permissions you need.
        - Create a managed identity in Azure.
            - Assign the deployer role to the managed identity.
            - add a federated identity to the managed identity.
                - under settings > Federated credentials
                - add the managed identity info.
        - Create a service connection in Azure Devops, but dont finish it.
            - check apply to all pipelines
        - Assign the role to the managed identity.

- Create Azure Storage account for terraform
    - create a blob container called azure-devops for the storage account 

- install terraform into Azure DevOps
    - https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks
    - 

- Azure DevOps CI/CD files.
    - https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/add-template-to-azure-pipelines?tabs=CLI


- parameters:
    - my IP
    - Azure region

