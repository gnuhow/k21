# k21
Simple blackjack web app hosted in Azure

## Infra deploy
- deploy VM
- terraform

## Container image deploy
- local buildah
- Azure Container Repo

## Infrastructure
- Azure Container Repo hosts images
- Azure Container Apps host backend
- keyvault for certs?
- load balancer?
- waf?
- iam roles?

## App
- Node.JS backend, default HTTP lib
- Frontend code modified in place by the backend.
- Normal JS/HTML/CSS frontend
