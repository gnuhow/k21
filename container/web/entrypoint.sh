# APP_URL="http://www.example.com"
sed -i "s~__APP_URL__~${APP_URL}~g" /etc/nginx/conf.d/default.conf && echo "custom entrypoint script complete"
