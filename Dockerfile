#FROM nginx
#COPY dist /usr/share/nginx/html
FROM node:lts
RUN mkdir -p /home/app
COPY . /home/app

EXPOSE 3000

CMD npm start

#CMD node server.js