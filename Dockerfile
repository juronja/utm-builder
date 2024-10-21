FROM node:lts
WORKDIR /app
COPY . .
RUN npm install

#RUN npm run build

EXPOSE 80

CMD ["node", "server.js"]