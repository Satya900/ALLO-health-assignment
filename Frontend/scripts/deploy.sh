#!/bin/bash

# Deployment script for production
set -e

# Configuration
DEPLOY_ENV=${1:-production}
BUILD_DIR="dist"
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment to $DEPLOY_ENV environment..."

# Validate environment
if [ "$DEPLOY_ENV" != "staging" ] && [ "$DEPLOY_ENV" != "production" ]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Check if build exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

# Load environment variables
if [ -f ".env.$DEPLOY_ENV" ]; then
    echo "📋 Loading environment variables for $DEPLOY_ENV..."
    export $(cat .env.$DEPLOY_ENV | grep -v '^#' | xargs)
else
    echo "⚠️ No environment file found for $DEPLOY_ENV"
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to deploy to different targets
deploy_to_static() {
    echo "📤 Deploying to static hosting..."
    
    # Example for AWS S3
    if [ -n "$AWS_S3_BUCKET" ]; then
        echo "📤 Uploading to S3 bucket: $AWS_S3_BUCKET"
        aws s3 sync $BUILD_DIR s3://$AWS_S3_BUCKET --delete --cache-control "max-age=31536000"
        aws s3 cp s3://$AWS_S3_BUCKET/index.html s3://$AWS_S3_BUCKET/index.html --cache-control "no-cache"
        
        if [ -n "$AWS_CLOUDFRONT_ID" ]; then
            echo "🔄 Invalidating CloudFront cache..."
            aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_ID --paths "/*"
        fi
    fi
    
    # Example for Netlify
    if [ -n "$NETLIFY_SITE_ID" ] && [ -n "$NETLIFY_AUTH_TOKEN" ]; then
        echo "📤 Deploying to Netlify..."
        npx netlify-cli deploy --prod --dir=$BUILD_DIR --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
    fi
    
    # Example for Vercel
    if command -v vercel &> /dev/null; then
        echo "📤 Deploying to Vercel..."
        vercel --prod --yes
    fi
}

deploy_to_server() {
    echo "📤 Deploying to server..."
    
    if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
        echo "❌ Server deployment requires DEPLOY_HOST, DEPLOY_USER, and DEPLOY_PATH"
        exit 1
    fi
    
    # Create backup of current deployment
    echo "💾 Creating backup..."
    ssh $DEPLOY_USER@$DEPLOY_HOST "mkdir -p $DEPLOY_PATH/$BACKUP_DIR && cp -r $DEPLOY_PATH/current $DEPLOY_PATH/$BACKUP_DIR/backup_$TIMESTAMP" || true
    
    # Upload new build
    echo "📤 Uploading files..."
    rsync -avz --delete $BUILD_DIR/ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/current/
    
    # Restart services if needed
    if [ -n "$RESTART_COMMAND" ]; then
        echo "🔄 Restarting services..."
        ssh $DEPLOY_USER@$DEPLOY_HOST "$RESTART_COMMAND"
    fi
}

deploy_to_docker() {
    echo "🐳 Building and deploying Docker image..."
    
    # Build Docker image
    docker build -t clinic-frontend:$TIMESTAMP .
    docker tag clinic-frontend:$TIMESTAMP clinic-frontend:latest
    
    # Push to registry if configured
    if [ -n "$DOCKER_REGISTRY" ]; then
        echo "📤 Pushing to Docker registry..."
        docker tag clinic-frontend:latest $DOCKER_REGISTRY/clinic-frontend:$TIMESTAMP
        docker tag clinic-frontend:latest $DOCKER_REGISTRY/clinic-frontend:latest
        docker push $DOCKER_REGISTRY/clinic-frontend:$TIMESTAMP
        docker push $DOCKER_REGISTRY/clinic-frontend:latest
    fi
    
    # Deploy with Docker Compose
    if [ -f "docker-compose.yml" ]; then
        echo "🚀 Deploying with Docker Compose..."
        docker-compose down || true
        docker-compose up -d
    fi
}

# Health check function
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo "🏥 Running health check on $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url/health" > /dev/null; then
            echo "✅ Health check passed!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Main deployment logic
case "$DEPLOY_TARGET" in
    "static")
        deploy_to_static
        ;;
    "server")
        deploy_to_server
        ;;
    "docker")
        deploy_to_docker
        ;;
    *)
        echo "🤔 No specific deployment target set. Trying Docker deployment..."
        deploy_to_docker
        ;;
esac

# Run health check if URL is provided
if [ -n "$HEALTH_CHECK_URL" ]; then
    health_check "$HEALTH_CHECK_URL"
fi

echo "✅ Deployment to $DEPLOY_ENV completed successfully!"
echo "🕐 Deployment time: $(date)"
echo ""
echo "📊 Deployment summary:"
echo "  Environment: $DEPLOY_ENV"
echo "  Timestamp: $TIMESTAMP"
echo "  Build size: $(du -sh $BUILD_DIR | cut -f1)"

# Cleanup old backups (keep last 5)
if [ -d "$BACKUP_DIR" ]; then
    echo "🧹 Cleaning up old backups..."
    ls -t $BACKUP_DIR/ | tail -n +6 | xargs -r rm -rf
fi

echo "🎉 Deployment completed!"