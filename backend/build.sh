#!/bin/bash
echo "Installing TypeScript..."
npm install typescript -g
echo "Building project..."
tsc -p tsconfig.json
echo "Build completed successfully." 