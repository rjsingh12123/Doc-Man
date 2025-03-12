# Use the official Node.js 16 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install the project dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the project (if using TypeScript)
RUN yarn build

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["node", "dist/main.js"] 