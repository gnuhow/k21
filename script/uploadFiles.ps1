$StorageAccountName = 'k21devops'
$ContainerName = 'container'

$Context = New-AzStorageContext -StorageAccountName $StorageAccountName

$HasContainer = $false;
$HasContainer = Get-AzStorageContainer $ContainerName -Context $Context

if ($HasContainer) {
    Write-Host "Skip making new storage container"
} else {
    Write-Host "Making storage container"
    $Container = New-AzStorageContainer $ContainerName -Context $Context
}

Set-AzStorageBlobContent -File 'container\web\index.html' -Container $ContainerName -Blob 'web\index.thml' -StandardBlobTier 'Hot'
