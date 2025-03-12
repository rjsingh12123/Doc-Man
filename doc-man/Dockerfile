# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy tsconfig.json first (explicitly)
COPY tsconfig.json ./

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"] 