# syntax=docker/dockerfile:1

# Use a small, supported Node LTS image
FROM node:20-alpine

WORKDIR /app

# Ensure production mode in container
ENV NODE_ENV=production

# Install a tiny init and curl for proper signal handling & healthchecks
RUN apk add --no-cache dumb-init curl

# Install dependencies first (better layer caching)
COPY package*.json ./
# Use npm ci when lockfile exists, otherwise fallback to install
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi && npm cache clean --force

# Copy the application source
COPY . .

# Use the non-root node user built into the image
USER node

# Expose the Express port
EXPOSE 3000

# Container healthcheck (Express health endpoint)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=5 \
  CMD curl -fsS http://localhost:3000/ || exit 1

# Use a minimal init to forward signals to Node for graceful shutdown
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the bot + Express server
CMD ["node", "bot.js"]
