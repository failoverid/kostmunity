#!/bin/bash

# Setup Kostmunity Web di VPS
# Run this script on your VPS server

set -e  # Exit on error

echo "🚀 Setting up Kostmunity Web..."

# 1. Extract uploaded file
echo "📦 Extracting files..."
cd /tmp
tar -xzf kostmunity-web.tar.gz

# 2. Move to web directory
echo "📁 Moving files to /var/www/kostmunity..."
sudo rm -rf /var/www/kostmunity
sudo mkdir -p /var/www/kostmunity
sudo cp -r dist/* /var/www/kostmunity/
sudo chown -R www-data:www-data /var/www/kostmunity
sudo chmod -R 755 /var/www/kostmunity

# 3. Create Nginx configuration
echo "⚙️  Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/kostmunity > /dev/null <<'EOF'
server {
    listen 80;
    server_name kostmnity.alfansyahprd.site;

    root /var/www/kostmunity;
    index index.html;

    # SPA routing - redirect all to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json
        application/xml
        image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/kostmunity-access.log;
    error_log /var/log/nginx/kostmunity-error.log;
}
EOF

# 4. Enable site
echo "🔗 Enabling site..."
sudo ln -sf /etc/nginx/sites-available/kostmunity /etc/nginx/sites-enabled/kostmunity

# 5. Test Nginx configuration
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# 6. Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Setup DNS A record: kostmnity.alfansyahprd.site -> 178.128.62.72"
echo "2. Wait for DNS propagation (1-5 minutes)"
echo "3. Run: sudo certbot --nginx -d kostmnity.alfansyahprd.site"
echo "4. Visit: https://kostmnity.alfansyahprd.site"
