#FROM nginx
#COPY dist /usr/share/nginx/html
FROM node:alpine
RUN mkdir -p /home/app
COPY dist /home/app
CMD node server.js