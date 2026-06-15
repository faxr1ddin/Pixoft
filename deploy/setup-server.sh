#!/usr/bin/env bash
# One-time setup script. Run on the droplet as root:
#   curl -fsSL https://raw.githubusercontent.com/<you>/pixoft-web/main/deploy/setup-server.sh | bash
# or copy this repo to the server and run it directly.
set -euo pipefail

echo "==> Installing Docker, Nginx, Certbot"
apt-get update -y
apt-get install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx

if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

echo "==> Creating app directory"
mkdir -p /opt/pixoft-web

echo "==> Configuring Nginx"
cp deploy/nginx/textilepro.app.conf /etc/nginx/sites-available/textilepro.app.conf

# Temporary HTTP-only config so certbot can issue the first cert
cat > /etc/nginx/sites-available/textilepro.app.conf <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name textilepro.app www.textilepro.app;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/textilepro.app.conf /etc/nginx/sites-enabled/textilepro.app.conf
rm -f /etc/nginx/sites-enabled/default
mkdir -p /var/www/certbot
nginx -t && systemctl reload nginx

echo "==> Done. Next steps:"
echo "1. Point textilepro.app DNS A record to this server's IP."
echo "2. Run: certbot --nginx -d textilepro.app -d www.textilepro.app"
echo "3. Replace /etc/nginx/sites-available/textilepro.app.conf with deploy/nginx/textilepro.app.conf (the HTTPS version) and reload nginx."
echo "4. cd /opt/pixoft-web && docker compose up -d --build"
