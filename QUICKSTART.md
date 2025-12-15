# Quick Start Guide - NineEdu Deployment

This guide will get you from zero to deployed in Azure as quickly as possible.

## ✅ What Was Created

Your repository now includes:

### Docker Configuration
- ✅ `src/backend/Dockerfile` - Production-ready backend container
- ✅ `src/frontend/Dockerfile` - Next.js standalone frontend container
- ✅ `docker-compose.yml` - Local development environment
- ✅ `.dockerignore` files - Optimized build contexts

### Terraform Infrastructure
- ✅ **3 Terraform Modules**:
  - Container Registry (ACR)
  - Key Vault (secrets management)
  - Container Apps (serverless containers)
- ✅ **2 Environment Configurations**:
  - Staging (`infrastructure/terraform/environments/staging/`)
  - Production (`infrastructure/terraform/environments/production/`)

### CI/CD Workflows
- ✅ `build-and-test.yml` - Runs on PRs to test code
- ✅ `deploy-staging.yml` - Auto-deploys `develop` branch
- ✅ `deploy-production.yml` - Auto-deploys `main` branch

### Code Updates
- ✅ Modified `next.config.ts` - Added standalone output
- ✅ Modified `firebase.js` - Supports environment variable
- ✅ Modified `server.js` - Dynamic CORS configuration

### Documentation
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `.env.example` files - Environment variable templates

## 🚀 5-Minute Quick Start

### 1. Prerequisites Check

Make sure you have accounts and tools:
- [ ] Azure account ([Sign up](https://azure.microsoft.com/free/))
- [ ] MongoDB Atlas ([Sign up](https://www.mongodb.com/cloud/atlas))
- [ ] Azure CLI installed
- [ ] Docker Desktop installed

### 2. Azure Setup (5 commands)

```bash
# Login
az login

# Create resource group
az group create --name nineedu-rg --location eastus

# Create storage for Terraform
az storage account create \
  --name nineudutfstate \
  --resource-group nineedu-rg \
  --location eastus \
  --sku Standard_LRS

# Create container
az storage container create \
  --name tfstate \
  --account-name nineudutfstate

# Create service principal (save the output!)
az ad sp create-for-rbac \
  --name "nineedu-github-actions" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/nineedu-rg \
  --sdk-auth
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create database user (save credentials!)
4. Network Access → Add IP: `0.0.0.0/0`
5. Copy connection string

### 4. Configure GitHub Secrets

Go to: **Repository Settings** → **Secrets and variables** → **Actions**

**Required Secrets (Minimum):**
```
AZURE_CREDENTIALS          # Paste the JSON from service principal command
AZURE_SUBSCRIPTION_ID      # Run: az account show --query id -o tsv

MONGO_URI_STAGING          # Your MongoDB connection string
MONGO_URI_PRODUCTION       # Your MongoDB connection string (can be same initially)

JWT_SECRET_STAGING         # Run: openssl rand -base64 32
JWT_SECRET_PRODUCTION      # Run: openssl rand -base64 32 (different!)

GEMINI_API_KEY            # Get from Google AI Studio
GROQ_API_KEY              # Get from Groq Console (or use empty string)

CLOUDINARY_CLOUD_NAME     # From Cloudinary dashboard
CLOUDINARY_API_KEY        # From Cloudinary dashboard
CLOUDINARY_API_SECRET     # From Cloudinary dashboard

FIREBASE_SERVICE_ACCOUNT  # Download JSON, convert to single line
PINATA_JWT                # From Pinata API keys
NEXT_PUBLIC_GATEWAY_URL   # Your Pinata gateway URL
```

### 5. Deploy!

**Option A: Automatic via Git**
```bash
# Create develop branch
git checkout -b develop
git push origin develop

# GitHub Actions will automatically deploy to staging!
```

**Option B: Manual Terraform**
```bash
# Initialize and deploy staging
cd infrastructure/terraform/environments/staging
terraform init

# Create terraform.tfvars with your secrets
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform plan
terraform apply
```

## 📋 Post-Deployment Checklist

After your first deployment:

- [ ] Verify frontend URL is accessible
- [ ] Verify backend API responds at `/api`
- [ ] Test API docs at `/api-docs`
- [ ] Check MongoDB connection is working
- [ ] Test login/authentication
- [ ] Create a test course
- [ ] Verify file uploads work (Cloudinary, Pinata)

## 🔄 Daily Workflow

### For Development
```bash
# 1. Create feature branch from develop
git checkout develop
git checkout -b feature/my-feature

# 2. Make changes, test locally with Docker
docker-compose up

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/my-feature

# 4. Create PR to develop
# GitHub Actions will test your code

# 5. Merge PR → auto-deploys to staging
```

### For Production Release
```bash
# 1. Test thoroughly on staging
# 2. Create PR from develop to main
# 3. Review and merge
# 4. Auto-deploys to production!
```

## 🆘 Quick Troubleshooting

### Deployment Failed?

1. **Check GitHub Actions logs**
   - Go to "Actions" tab
   - Click on the failed workflow
   - Expand the red X steps

2. **Common issues:**
   - Missing GitHub secrets → Add them
   - Terraform state locked → Wait or run `az storage blob lease break`
   - Docker build fails → Check Dockerfile syntax
   - Container won't start → Check environment variables

### Container Not Starting?

```bash
# View logs
az containerapp logs show \
  --name staging-backend \
  --resource-group nineedu-staging-rg \
  --follow
```

### Can't Connect to MongoDB?

1. Check connection string format
2. Verify network access in MongoDB Atlas (allow `0.0.0.0/0`)
3. Ensure password doesn't have special characters that need escaping

## 📚 Learn More

- **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture overview**: See the plan file
- **Terraform docs**: Check `infrastructure/terraform/` modules

## 🎉 Success!

Once deployed, you'll have:
- ✅ Automatic deployments on git push
- ✅ Separate staging and production environments
- ✅ Infrastructure as code (easy to recreate)
- ✅ HTTPS enabled automatically
- ✅ Auto-scaling based on traffic
- ✅ Professional DevOps setup

**Your applications will be available at:**
- Frontend: `https://{env}-frontend.{random}.azurecontainerapps.io`
- Backend: `https://{env}-backend.{random}.azurecontainerapps.io`

Get the exact URLs from:
```bash
cd infrastructure/terraform/environments/staging
terraform output frontend_url
terraform output backend_url
```

---

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting!
