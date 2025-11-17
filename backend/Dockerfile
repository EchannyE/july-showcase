# Stage 1: Define the base image for Node.js
# We use a recent version (e.g., node:20-slim) to keep the image size small
FROM node:20-slim

# Set environment variables for the application
ENV NODE_ENV production

# Install system dependencies required by 'pdf-poppler' (Poppler utilities)
# The `apt-get` command installs necessary Linux packages.
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package definition files
# This allows Docker to use caching for the install step
COPY package*.json ./

# Install Node.js dependencies
# The --omit=dev flag prevents installing dev dependencies, saving space
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Inform Docker that the container will listen on this port.
# Render automatically injects the correct PORT environment variable.
EXPOSE 8080

# Define the command to run the application when the container starts
CMD ["npm", "start"]