FROM node:lts-alpine
WORKDIR /app
# Installer curl pour le healthcheck
RUN apk add --no-cache curl
COPY . .
RUN yarn install --production
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl --fail http://localhost:3000/version || exit 1
EXPOSE 3000
CMD ["node", "src/index.js"]
