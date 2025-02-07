FROM nginx
LABEL maintainer="gnuhow"
COPY ./nginx.conf /etc/nginx/conf.d/default.conf 
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./index.js /usr/share/nginx/html/index.js
COPY ./styles.css /usr/share/nginx/html/styles.css
COPY ./entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh
EXPOSE 7000