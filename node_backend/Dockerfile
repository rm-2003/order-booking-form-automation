FROM node:18-alpine

WORKDIR /app

# Install netcat for the wait-for-database functionality
RUN apk add --no-cache netcat-openbsd dos2unix

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Copy migration files to the correct location
RUN mkdir -p /app/dist/database && \
    cp -r src/database/migrations /app/dist/database/

# Expose the port the app runs on
EXPOSE 4000

# Copy and prepare the entrypoint script
COPY ./docker-entrypoint.sh /
RUN dos2unix /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"] 