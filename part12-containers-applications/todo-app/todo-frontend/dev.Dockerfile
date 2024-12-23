FROM node:20

WORKDIR /usr/src/app

COPY . .

# npm install instead of npm ci for dev
RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]