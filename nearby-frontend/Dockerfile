# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the frontend build to Nginx's default web root
COPY --from=build /app/dist /usr/share/nginx/html

# Serve on port 8081
EXPOSE 8081

# Update Nginx to listen on 8081 instead of 80
RUN sed -i 's/listen       80;/listen       8081;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
