FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source and data
COPY src/ ./src/
COPY data/ ./data/

# Create output directory
RUN mkdir -p output

# Run the generator
CMD ["node", "src/generator.js"]
