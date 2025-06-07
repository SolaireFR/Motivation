FROM node:lts-slim

WORKDIR /app

COPY . .
RUN npm i
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]