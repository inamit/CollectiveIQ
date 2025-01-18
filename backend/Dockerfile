#Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build:prod

#Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

COPY ./ssl /app/ssl

CMD ["node", "dist/app.js"]