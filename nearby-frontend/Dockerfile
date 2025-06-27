# Etapa 1 – build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Etapa 2 – Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/public/images /usr/share/nginx/html/images
COPY distritos_map.json /usr/share/nginx/html/
COPY DCF_PT.json /usr/share/nginx/html/
COPY AmenityFilters.json /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
