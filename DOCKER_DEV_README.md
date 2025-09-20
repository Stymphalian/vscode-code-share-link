# Docker Development Environment

Development container for VS Code extension development with Node.js and TypeScript support.

## Prerequisites

- Docker Desktop installed and running

## Basic Commands

### Start Development Container
```bash
# Build and start the container
docker-compose up --build

# Start in background
docker-compose up -d
```

### Enter Container Shell
```bash
# Get an interactive shell
docker-compose run --rm dev bash
```

### Development Commands
```bash
# Install dependencies
npm install

# Watch mode (auto-compile TypeScript)
npm run watch

# Run tests
npm test

# Lint code
npm run lint

# Compile TypeScript
npm run compile
```

### Stop Container
```bash
# Stop the container
docker-compose down
```

## File Structure

- Your workspace is mounted at `/workspace`
- Changes to files are immediately reflected
- Dependencies are installed in the container