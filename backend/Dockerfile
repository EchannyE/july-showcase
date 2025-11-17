# Stage 1: Define the base image for Node.js
FROM node:20-slim

# Set environment variables for the application
ENV NODE_ENV production

# Install System Dependencies for Tesseract OCR and Poppler
#
# 1. build-essential/g++ are often needed to compile native Node modules.
# 2. libleptonica-dev and libtesseract-dev are the core system libraries 
#    required for Tesseract to function in a Linux environment.
# 3. poppler-utils is required by the pdf-poppler package.
# 4. We clean up after installation to keep the final image size smaller.
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    libleptonica-dev \
    libtesseract-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package definition files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Inform Docker that the container will listen on this port.
EXPOSE 8080

# Define the command to run the application when the container starts
CMD ["npm", "start"]