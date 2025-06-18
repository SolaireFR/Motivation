FROM node:lts-slim

WORKDIR /app

COPY . .
RUN npm i --legacy-peer-deps
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]