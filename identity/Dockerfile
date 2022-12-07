FROM node:14.15.0

WORKDIR /

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]