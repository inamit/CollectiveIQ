# Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the Vite application
RUN npm run build

# Serve Stage
FROM nginx:alpine

# Copy built files to Nginx's default public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ./ssl/key.pem /etc/nginx/
COPY ./ssl/cert.pem /etc/nginx/

# Expose port 443 for HTTPS
EXPOSE 443

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

