# NineEdu Deployment Guide

Complete guide for deploying the NineEdu Learning Management System to Azure using Docker, Terraform, and GitHub Actions.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Setup](#azure-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Local Testing](#local-testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before starting, ensure you have the following installed and configured:

### Required Tools
- **Azure CLI** - [Install Guide](https://docs.microsoft.com/cli/azure/install-azure-cli)
- **Terraform** (v1.6+) - [Download](https://www.terraform.io/downloads)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/downloads)
- **Node.js** (v20+) - [Download](https://nodejs.org/)

### Required Accounts
- Azure account with active subscription
- MongoDB Atlas account
- GitHub account with this repository
- Firebase project with service account
- Cloudinary account
- Google AI API key
- Groq API key (optional)
- Pinata account for IPFS

## 🚀 Azure Setup

### Step 1: Login to Azure

```bash
az login
```

### Step 2: Set Your Subscription

```bash
# List available subscriptions
az account list --output table

# Set the subscription you want to use
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### Step 3: Create Resource Group

```bash
az group create --name nineedu-rg --location eastus
```

### Step 4: Create Storage Account for Terraform State

```bash
# Create storage account
az storage account create \
  --name nineudutfstate \
  --resource-group nineedu-rg \
  --location eastus \
  --sku Standard_LRS

# Get the storage account key
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group nineedu-rg \
  --account-name nineudutfstate \
  --query '[0].value' -o tsv)

# Create blob container for Terraform state
az storage container create \
  --name tfstate \
  --account-name nineudutfstate \
  --account-key $ACCOUNT_KEY
```

### Step 5: Create Service Principal for GitHub Actions

```bash
# Get your subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Create service principal with contributor role
az ad sp create-for-rbac \
  --name "nineedu-github-actions" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/nineedu-rg \
  --sdk-auth

# Save the entire JSON output - you'll need it for GitHub Secrets
```

The output will look like this (save it securely):
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  "activeDirectoryEndpointUrl": "...",
  "resourceManagerEndpointUrl": "...",
  ...
}
```

## 🗄️ MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free M0 tier available)
4. Create two databases: `nineedu-staging` and `nineedu-production`

### Step 2: Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Create a user with read/write access
4. Save the username and password

### Step 3: Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. For initial setup, use `0.0.0.0/0` (allow from anywhere)
   - **Note**: This is less secure but simpler for initial setup
   - Later, add specific Azure Container Apps outbound IPs

### Step 4: Get Connection String

1. Go to **Database** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `myFirstDatabase` with `nineedu-staging` or `nineedu-production`

Example:
```
mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/nineedu-staging?retryWrites=true&w=majority
```

## 🔐 GitHub Secrets Configuration

Navigate to your GitHub repository: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Azure Credentials

| Secret Name | Value | How to Get |
|------------|-------|------------|
| `AZURE_CREDENTIALS` | Full JSON output from service principal creation | Step 5 of Azure Setup |
| `AZURE_SUBSCRIPTION_ID` | Your Azure subscription ID | Run: `az account show --query id -o tsv` |

### Application Secrets

| Secret Name | Value | Notes |
|------------|-------|-------|
| `MONGO_URI_STAGING` | MongoDB connection string | For staging database |
| `MONGO_URI_PRODUCTION` | MongoDB connection string | For production database |
| `JWT_SECRET_STAGING` | Random 32+ character string | Generate: `openssl rand -base64 32` |
| `JWT_SECRET_PRODUCTION` | Different random 32+ character string | Generate: `openssl rand -base64 32` |
| `GEMINI_API_KEY` | Google GenAI API key | Get from Google AI Studio |
| `GROQ_API_KEY` | Groq API key | Get from Groq Console |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | From Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | From Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | From Cloudinary Dashboard |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (as single-line string) | Download from Firebase Console → Project Settings → Service Accounts |
| `PINATA_JWT` | Pinata JWT token | From Pinata API Keys |
| `NEXT_PUBLIC_GATEWAY_URL` | Pinata gateway URL | Example: `https://gateway.mypinata.cloud` |

### Converting Firebase JSON to Single Line

```bash
# On Linux/Mac
cat serviceAccountKey.json | jq -c

# On Windows (PowerShell)
Get-Content serviceAccountKey.json | ConvertFrom-Json | ConvertTo-Json -Compress
```

## 🧪 Local Testing

### Step 1: Set Up Environment Variables

```bash
# Copy environment example files
cp .env.example .env
cp src/backend/.env.example src/backend/.env
cp src/frontend/.env.example src/frontend/.env.local

# Edit each file and fill in your actual values
```

### Step 2: Test with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5002
# API Docs: http://localhost:5002/api-docs

# Stop services
docker-compose down
```

### Step 3: Test Individual Services

**Backend:**
```bash
cd src/backend
npm install
npm start
```

**Frontend:**
```bash
cd src/frontend
npm install
npm run build
npm start
```

## 🚢 Deployment

### Initial Infrastructure Setup

Before deploying via GitHub Actions, initialize Terraform for each environment:

**Staging:**
```bash
cd infrastructure/terraform/environments/staging

# Initialize Terraform
terraform init

# Create a terraform.tfvars file (don't commit this!)
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars and fill in your values

# Plan and apply manually for the first time
terraform plan
terraform apply
```

**Production:**
```bash
cd infrastructure/terraform/environments/production

terraform init
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with production values

terraform plan
terraform apply
```

### Automated Deployment via GitHub Actions

Once the infrastructure is initialized:

**Deploy to Staging:**
1. Push changes to the `develop` branch
2. GitHub Actions will automatically:
   - Build Docker images
   - Push to Azure Container Registry
   - Deploy to staging environment via Terraform
3. Check the Actions tab for deployment status
4. Get URLs from the workflow output

**Deploy to Production:**
1. Merge `develop` into `main` branch
2. GitHub Actions will automatically:
   - Build Docker images
   - Push to Azure Container Registry
   - Deploy to production environment via Terraform
   - Create a GitHub release
3. Check the Actions tab for deployment status

### Manual Deployment

If you need to deploy manually:

```bash
# 1. Build and push Docker images
az acr login --name nineedustagingacr

docker build -t nineedustagingacr.azurecr.io/backend:manual ./src/backend
docker build -t nineedustagingacr.azurecr.io/frontend:manual \
  --build-arg NEXT_PUBLIC_API_URL=https://your-backend-url/api \
  --build-arg NEXT_PUBLIC_GATEWAY_URL=your-gateway-url \
  ./src/frontend

docker push nineedustagingacr.azurecr.io/backend:manual
docker push nineedustagingacr.azurecr.io/frontend:manual

# 2. Deploy with Terraform
cd infrastructure/terraform/environments/staging
terraform apply -var="image_tag=manual"
```

## 🔍 Monitoring and Verification

### Check Deployment Status

```bash
# List resource groups
az group list --output table

# List Container Apps
az containerapp list --resource-group nineedu-staging-rg --output table

# Get application URLs
az containerapp show \
  --name staging-frontend \
  --resource-group nineedu-staging-rg \
  --query properties.configuration.ingress.fqdn -o tsv

# View logs
az containerapp logs show \
  --name staging-backend \
  --resource-group nineedu-staging-rg \
  --follow
```

### Health Checks

Once deployed, verify the applications are running:

```bash
# Check backend health
curl https://your-backend-url.azurecontainerapps.io/

# Check API documentation
curl https://your-backend-url.azurecontainerapps.io/api-docs

# Check frontend
curl https://your-frontend-url.azurecontainerapps.io/
```

## 🐛 Troubleshooting

### Common Issues

**1. Container fails to start**
```bash
# View container logs
az containerapp logs show \
  --name staging-backend \
  --resource-group nineedu-staging-rg \
  --follow

# Common causes:
# - Missing environment variables
# - Incorrect MongoDB connection string
# - Firebase service account JSON format issues
```

**2. CORS errors**
```bash
# Ensure ALLOWED_ORIGINS includes your frontend URL
# Update in Terraform: infrastructure/terraform/modules/container-apps/main.tf
```

**3. MongoDB connection timeout**
```bash
# Check MongoDB Atlas network access
# Add 0.0.0.0/0 or specific Azure outbound IPs
```

**4. Terraform state locked**
```bash
# Unlock manually (be careful!)
az storage blob lease break \
  --container-name tfstate \
  --blob-name staging.terraform.tfstate \
  --account-name nineudutfstate
```

**5. Docker build fails on frontend**
```bash
# Ensure next.config.ts has output: 'standalone'
# Check that all build args are provided
```

### Rollback Procedure

If a deployment fails, you can rollback to a previous version:

```bash
cd infrastructure/terraform/environments/staging

# Find previous image tag from GitHub Actions or ACR
az acr repository show-tags \
  --name nineedustagingacr \
  --repository backend \
  --orderby time_desc

# Rollback to specific tag
terraform apply -var="image_tag=staging-abc1234-1234567890"
```

### Cost Management

Monitor Azure costs:
```bash
# View current month's costs
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 \
  --output table

# Set up budget alerts in Azure Portal
```

## 📊 Next Steps

After successful deployment:

1. **Custom Domain**: Add your custom domain to Container Apps
2. **SSL Certificate**: Configure custom SSL (automatic with Azure Container Apps)
3. **Monitoring**: Set up Application Insights
4. **Alerts**: Configure alerts for errors and performance
5. **Backups**: Verify MongoDB Atlas backup schedule
6. **CI/CD Optimization**: Add testing stages, staging approvals
7. **Security**: Review and tighten network access rules
8. **Scaling**: Adjust replica counts based on traffic

## 📚 Additional Resources

- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review Azure Container Apps logs
3. Verify all GitHub Secrets are correctly configured
4. Check MongoDB Atlas network access and connection string
5. Ensure all environment variables match between local and cloud

---

**Congratulations!** You now have a production-ready deployment pipeline for your NineEdu LMS application! 🎉
