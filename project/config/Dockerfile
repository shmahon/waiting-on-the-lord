FROM node:18-alpine

WORKDIR /app

# Install Chromium for Mermaid CLI (required for diagram generation)
RUN apk add --no-cache chromium

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files (from project/config on host)
COPY project/config/package*.json ./

# Install all dependencies (including dev dependencies for mermaid-cli)
RUN npm install

# Copy project structure
COPY project/src/ ./project/src/
COPY project/data/ ./project/data/
COPY project/scripts/ ./project/scripts/

# Copy study structure
COPY study/diagrams/ ./study/diagrams/

# Create output directory
RUN mkdir -p study/output

# Generate diagram and then run the document generator
CMD sh -c "npx mmdc -i study/diagrams/lexeme-overview.md -o study/output/lexeme-overview-temp.png -t neutral -b transparent -w 1400 -H 2000 && mv study/output/lexeme-overview-temp.png study/output/lexeme-overview.png && node project/src/generator.js"
