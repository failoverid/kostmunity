# Deploy Kostmunity ke VPS - Step by Step

## 📋 Prerequisites

- VPS: 178.128.62.72
- Domain: kostmnity.alfansyahprd.site
- SSH access ke VPS

## 🚀 Step 1: Upload File ke VPS

File `kostmunity-web.tar.gz` sudah ready. Upload ke VPS:

### Opsi A: Menggunakan SCP (dari CMD/PowerShell)

```bash
scp kostmunity-web.tar.gz root@178.128.62.72:/tmp/
scp setup-vps.sh root@178.128.62.72:/tmp/
```

### Opsi B: Menggunakan FileZilla/WinSCP

1. Buka FileZilla/WinSCP
2. Connect ke:
   - Host: `178.128.62.72`
   - Username: `root` (atau username VPS kamu)
   - Port: `22`
3. Upload files:
   - `kostmunity-web.tar.gz` → `/tmp/`
   - `setup-vps.sh` → `/tmp/`

## 🌐 Step 2: Setup DNS Subdomain

**PENTING: Lakukan ini dulu sebelum setup SSL!**

1. Login ke DNS provider (Cloudflare/Namecheap/dll)
2. Tambah A record:
   - Type: `A`
   - Name: `kostmnity`
   - Value: `178.128.62.72`
   - TTL: `Auto` atau `300`

3. Tunggu DNS propagate (1-5 menit)
4. Test dengan: `ping kostmnity.alfansyahprd.site`

## 🖥️ Step 3: Setup di VPS

SSH ke VPS dan jalankan setup script:

```bash
# SSH ke VPS
ssh root@178.128.62.72

# Masuk ke folder tmp
cd /tmp

# Beri permission execute ke script
chmod +x setup-vps.sh

# Jalankan setup script
./setup-vps.sh
```

Script akan otomatis:
- ✅ Extract files
- ✅ Move ke `/var/www/kostmunity`
- ✅ Setup Nginx config
- ✅ Restart Nginx

## 🔒 Step 4: Setup SSL (HTTPS)

Masih di VPS, jalankan:

```bash
# Install Certbot (kalau belum ada)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Setup SSL untuk subdomain
sudo certbot --nginx -d kostmnity.alfansyahprd.site

# Ikuti prompts:
# - Enter email: [email kamu]
# - Agree to ToS: Yes (Y)
# - Share email: No (N)
```

Certbot akan otomatis:
- Generate SSL certificate
- Update Nginx config
- Redirect HTTP ke HTTPS

## ✅ Step 5: Verifikasi

1. **Test HTTP**: `http://kostmnity.alfansyahprd.site` (should redirect ke HTTPS)
2. **Test HTTPS**: `https://kostmnity.alfansyahprd.site` ✨
3. **Test routing**: Navigate ke berbagai pages, refresh browser

## 🔄 Update Deployment (Next Time)

Kalau ada update aplikasi:

```bash
# 1. Di lokal - rebuild web
npm run export
tar -czf kostmunity-web.tar.gz dist

# 2. Upload ke VPS
scp kostmunity-web.tar.gz root@178.128.62.72:/tmp/

# 3. Di VPS - extract dan replace
ssh root@178.128.62.72
cd /tmp
tar -xzf kostmunity-web.tar.gz
sudo rm -rf /var/www/kostmunity/*
sudo cp -r dist/* /var/www/kostmunity/
sudo chown -R www-data:www-data /var/www/kostmunity
sudo systemctl reload nginx
```

## 🐛 Troubleshooting

### Site tidak bisa diakses
```bash
# Check Nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/kostmunity-error.log
```

### 404 saat refresh page
Nginx config sudah include `try_files $uri $uri/ /index.html` untuk SPA routing.

### SSL error
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### DNS belum propagate
```bash
# Check DNS
nslookup kostmnity.alfansyahprd.site
dig kostmnity.alfansyahprd.site
```

## 📝 Notes

- SSL certificate auto-renew setiap 90 hari
- Nginx logs di `/var/log/nginx/kostmunity-*.log`
- Web files di `/var/www/kostmunity`
- Nginx config di `/etc/nginx/sites-available/kostmunity`
