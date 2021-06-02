FROM node:12

WORKDIR /app1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD [ "npm", "start" ]