# Multi-Language Docker Development Environment

This setup provides a comprehensive development container supporting Python, Go, Node.js/TypeScript, and web development without installing dependencies on your host machine.

## Prerequisites

- Docker Desktop installed and running
- Git (for version control)

## Quick Start

1. **Customize your project (optional):**
   ```bash
   # Copy the environment template
   copy env.example .env
   
   # Edit .env to set your project name
   # PROJECT_NAME=my-awesome-project
   ```

2. **Build and start the development container:**
   ```bash
   docker-compose up --build
   ```

3. **Access your development environment:**
   - The container will start with an interactive bash shell
   - All your code is mounted at `/workspace`

## Supported Technologies

### Languages & Runtimes
- **Python 3.12** with pip, poetry, pipenv
- **Go 1.23** with go modules
- **Node.js 20 LTS** with npm, yarn, pnpm

### Development Tools
- **Python**: black, flake8, pytest, mypy, pre-commit
- **Go**: goimports, golangci-lint, delve debugger
- **Node.js**: TypeScript, ESLint, Prettier, Jest, Vite, Angular CLI, NestJS CLI

### Web Frameworks Ready
- React (Vite, Create React App)
- Vue.js (Vite, Create Vue)
- Svelte (Vite)
- Angular
- Next.js
- Express.js
- Django/FastAPI (Python)
- Gin/Echo (Go)

## Development Workflow

### Start Development Services
```bash
# Start the main development service
docker-compose up dev

# Start in background
docker-compose up -d dev

# Start specific language service
docker-compose --profile python up -d python
docker-compose --profile go up -d go
```

### Interactive Shell
```bash
# Get an interactive shell in the container
docker-compose run --rm shell

# Or use the shell service
docker-compose --profile shell up -d shell
```

### Language-Specific Commands

#### Python Development
```bash
# Create virtual environment
docker-compose exec dev python -m venv .venv
docker-compose exec dev source .venv/bin/activate

# Install dependencies
docker-compose exec dev pip install -r requirements.txt
# or with poetry
docker-compose exec dev poetry install

# Run tests
docker-compose exec dev python -m pytest
docker-compose exec dev python -m pytest --cov=src

# Run linting
docker-compose exec dev black src/
docker-compose exec dev flake8 src/
docker-compose exec dev mypy src/
```

#### Go Development
```bash
# Initialize Go module
docker-compose exec dev go mod init your-project

# Install dependencies
docker-compose exec dev go mod tidy

# Run tests
docker-compose exec dev go test ./...

# Run linting
docker-compose exec dev golangci-lint run

# Build
docker-compose exec dev go build -o bin/app ./cmd/app
```

#### Node.js/TypeScript Development
```bash
# Initialize project
docker-compose exec dev npm init -y
docker-compose exec dev npm install typescript @types/node

# Install dependencies
docker-compose exec dev npm install
# or with yarn
docker-compose exec dev yarn install

# Run development server
docker-compose exec dev npm run dev
docker-compose exec dev npm run build

# Run tests
docker-compose exec dev npm test
docker-compose exec dev npm run test:coverage

# Run linting
docker-compose exec dev npm run lint
docker-compose exec dev npm run format
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## File Structure in Container

- Your entire workspace is mounted at `/workspace`
- Dependencies are installed in the container (not on host)
- Changes to files are immediately reflected due to volume mounting
- Common directories: `/workspace/src`, `/workspace/tests`, `/workspace/docs`

## Ports

- **3000**: React/Next.js development server
- **5173**: Vite development server
- **8000**: Python/Django development server
- **8080**: Go/Express development server
- **9000**: Additional port for custom services

## Environment Variables

- `PROJECT_NAME`: Your project name (default: ai-starter-project)
- `NODE_ENV=development`
- `PYTHONPATH=/workspace`
- `GOPATH=/workspace/go`

## Project Customization

1. **Set your project name:**
   ```bash
   # Create .env file
   echo "PROJECT_NAME=my-awesome-project" > .env
   ```

2. **Customize ports in docker-compose.yaml if needed**

3. **Add project-specific dependencies:**
   - Python: Add to `requirements.txt` or `pyproject.toml`
   - Go: Add to `go.mod`
   - Node.js: Add to `package.json`

## Troubleshooting

### Port Already in Use
Modify the port mapping in `docker-compose.yaml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 on host
```

### File Watching Issues
The container is configured for better Windows compatibility. If you experience issues:

1. Ensure Docker Desktop has access to your workspace directory
2. Check that the volume mounts are working correctly
3. Restart the container: `docker-compose restart dev`

### Dependencies Issues
```bash
# Python
docker-compose exec dev pip install --upgrade pip
docker-compose exec dev pip install -r requirements.txt

# Node.js
docker-compose exec dev rm -rf node_modules package-lock.json
docker-compose exec dev npm install

# Go
docker-compose exec dev go mod tidy
```

## Benefits

- **Multi-language support**: Python, Go, Node.js in one container
- **No host dependencies**: Everything runs in the container
- **Consistent environment**: Same setup across different machines
- **Isolation**: Development environment doesn't affect your system
- **Easy cleanup**: Remove container to clean up completely
- **Team consistency**: Everyone uses the same development environment
- **AI-friendly**: Perfect for Cursor and other AI development tools