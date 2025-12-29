# Deploy Web ke VPS

## 1. Upload Build ke VPS

Dari komputer lokal, jalankan:

```bash
# Compress dist folder
tar -czf kostmunity-web.tar.gz dist/

# Upload ke VPS (ganti YOUR_USERNAME dengan username VPS kamu)
scp kostmunity-web.tar.gz YOUR_USERNAME@178.128.62.72:/var/www/

# Atau gunakan WinSCP/FileZilla untuk upload folder dist/
```

## 2. Setup di VPS

SSH ke VPS:

```bash
ssh YOUR_USERNAME@178.128.62.72
```

Extract dan setup:

```bash
cd /var/www/
tar -xzf kostmunity-web.tar.gz
sudo mv dist kostmunity
sudo chown -R www-data:www-data kostmunity
```

## 3. Nginx Configuration

Buat file config Nginx:

```bash
sudo nano /etc/nginx/sites-available/kostmunity
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name 178.128.62.72;  # Atau domain kamu jika ada

    root /var/www/kostmunity;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site dan restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/kostmunity /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 4. Akses Website

Buka browser: `http://178.128.62.72`

## 5. Setup HTTPS (Optional tapi Recommended)

Install Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Jika punya domain, setup SSL:

```bash
sudo certbot --nginx -d your-domain.com
```

## 6. Update Deployment (untuk build selanjutnya)

```bash
# Dari lokal
scp -r dist/* YOUR_USERNAME@178.128.62.72:/var/www/kostmunity/

# Atau jika sudah tar
scp kostmunity-web.tar.gz YOUR_USERNAME@178.128.62.72:/tmp/
ssh YOUR_USERNAME@178.128.62.72 "cd /var/www && tar -xzf /tmp/kostmunity-web.tar.gz && sudo chown -R www-data:www-data kostmunity"
```

## Troubleshooting

### 404 on refresh
Pastikan `try_files` di Nginx config sudah benar untuk SPA routing.

### Permission denied
```bash
sudo chown -R www-data:www-data /var/www/kostmunity
sudo chmod -R 755 /var/www/kostmunity
```

### Nginx error
```bash
sudo nginx -t  # Test config
sudo tail -f /var/log/nginx/error.log  # Check logs
```
