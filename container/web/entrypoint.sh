# APP_URL="https://www.example.com"
# echo "remote URL: ${APP_URL}"
curl "${APP_URL}/start"
sed -i "s~__APP_URL__~${APP_URL}~g" /etc/nginx/conf.d/default.conf && echo "custom entrypoint script complete"
