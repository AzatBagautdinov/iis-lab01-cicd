FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
FROM development AS test
RUN npm run lint && npm run test:coverage && npm run build
FROM node:22-alpine AS production
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3101
WORKDIR /app
COPY --chown=node:node src ./src
USER node
EXPOSE 3101
HEALTHCHECK --interval=10s --timeout=3s CMD node -e "require('http').get('http://localhost:3101/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "src/app.js"]
