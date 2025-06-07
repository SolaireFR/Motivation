FROM node:lts-slim as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# stage 2
FROM nginx:alpine
COPY --from=node /app/dist/motivation-frontend/browser /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf