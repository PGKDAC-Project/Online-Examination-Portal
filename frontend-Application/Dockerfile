FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (required for build step)
RUN npm install

# Copy source code
COPY . .

# Set Build Arguments for Vite (Required for production URLs)
ARG VITE_API_BASE_URL
ARG VITE_ADMIN_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ADMIN_API_BASE_URL=$VITE_ADMIN_API_BASE_URL

# Build application
RUN npm run build

FROM nginx:alpine AS production

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]