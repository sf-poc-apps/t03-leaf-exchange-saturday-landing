FROM nginx:1.27-alpine
ENV PORT=8080 SF_EXPIRES="" SF_ENV="staging"
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY public/ /usr/share/nginx/html/
COPY sf-banner.js /usr/share/nginx/html/sf-banner.js
EXPOSE 8080
