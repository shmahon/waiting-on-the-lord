#!/bin/bash

set -e

echo "=== Waiting on the Lord - Document Builder ==="
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "Building with Docker..."
    docker build -f project/config/Dockerfile -t waiting-on-the-lord:latest .
    docker run --rm -v "$(pwd)/study/output:/app/study/output" waiting-on-the-lord:latest
    echo ""
    echo "✓ Document generated in study/output/waiting_on_the_lord_analysis.docx"
else
    echo "Docker not found. Building with local Node.js..."

    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        echo "Error: Node.js is not installed."
        echo "Please install Node.js 18+ or Docker to build this document."
        exit 1
    fi

    # Install dependencies if needed
    if [ ! -d "project/config/node_modules" ]; then
        echo "Installing dependencies..."
        cd project/config && npm install && cd ../..
    fi

    # Generate lexeme overview diagram
    echo "Generating lexeme overview diagram..."
    ./project/scripts/generate-diagram.sh
    echo ""

    # Run the generator
    echo "Generating document..."
    node project/src/generator.js
    echo ""
    echo "✓ Document generated in study/output/waiting_on_the_lord_analysis.docx"
fi
