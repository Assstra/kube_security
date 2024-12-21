# Stage 1: Build dependencies
FROM node:23 AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Stage 2: Build the app
FROM node:23
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000

CMD ["npm", "start"]