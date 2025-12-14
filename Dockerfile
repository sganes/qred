# Development stage
FROM node:25-alpine

WORKDIR /app

# Install OpenSSL and other dependencies for Prisma
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema and config files
COPY prisma ./prisma
COPY tsconfig.json ./

# Generate Prisma client
RUN npm run prisma:generate

# Copy source code
COPY src ./src

# Expose port
EXPOSE 3000

# Run in development mode with ts-node and regenerate on start
CMD ["sh", "-c", "npm run prisma:generate && npm run dev"]
