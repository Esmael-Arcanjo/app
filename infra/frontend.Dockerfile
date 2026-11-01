FROM node:20-alpine AS build
WORKDIR /web
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
ARG REACT_APP_BACKEND_URL
RUN yarn build

FROM nginx:1.27-alpine
COPY --from=build /web/build /usr/share/nginx/html
RUN printf 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf
