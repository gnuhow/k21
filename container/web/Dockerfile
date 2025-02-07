FROM nginx
# USER root
LABEL maintainer="gnuhow"
WORKDIR /home/node
COPY ./default.conf /etc/nginx/conf.d/default.conf 
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./index.js /usr/share/nginx/html/index.js
COPY ./styles.css /usr/share/nginx/html/styles.css
RUN ls /usr/share/nginx/html
EXPOSE 7000