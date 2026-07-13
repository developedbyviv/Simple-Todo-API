# Stage 1: Development


FROM node:22 as development
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

# Stage 2: Production
FROM node:22-alpine as production
WORKDIR /app
COPY package*.json .

RUN npm install --omit=development
COPY . .
EXPOSE 3000
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser
CMD [ "node", "index.js" ]