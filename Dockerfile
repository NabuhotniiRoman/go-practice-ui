# Dockerfile для React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Копіюємо package файли
COPY package*.json ./
RUN npm ci

# Копіюємо весь код та будуємо
COPY . .
RUN npm run build

# Фінальний образ з Nginx
FROM nginx:alpine

# Копіюємо збудований додаток
COPY --from=builder /app/dist /usr/share/nginx/html

# Копіюємо конфігурацію Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Відкриваємо порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
