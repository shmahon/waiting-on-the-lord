FROM node:18-alpine

WORKDIR /app

# Install Chromium for Mermaid CLI (required for diagram generation)
RUN apk add --no-cache chromium

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for mermaid-cli)
RUN npm install

# Copy source, data, scripts, and diagram source
COPY src/ ./src/
COPY data/ ./data/
COPY scripts/ ./scripts/
COPY lexeme-overview.md ./

# Create output directory
RUN mkdir -p output

# Generate diagram and then run the document generator
CMD sh -c "npx mmdc -i lexeme-overview.md -o output/lexeme-overview-temp.png -t neutral -b transparent -w 1400 -H 2000 && mv output/lexeme-overview-temp.png output/lexeme-overview.png && node src/generator.js"
