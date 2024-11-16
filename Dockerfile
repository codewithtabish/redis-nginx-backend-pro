# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Compile TypeScript code
RUN npm run build

# Stage 2: Final Image
FROM node:18-alpine

WORKDIR /app

# Copy compiled dist files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose necessary port (adjust based on your needs)
EXPOSE 14000

# Set environment variable
ENV NODE_ENV=production
ENV PORT=14000

# Start the app
CMD ["node", "dist/index.js"]
