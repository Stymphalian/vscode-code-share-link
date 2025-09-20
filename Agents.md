# VSCode Code Share Link Extension - AI Agent Context

This document provides comprehensive context for AI agents working on the VSCode Code Share Link extension project. It contains all necessary information to understand, maintain, and extend this VS Code extension.

## Project Overview

**Project Name:** vscode-code-share-link  
**Repository:** https://github.com/Stymphalian/vscode-code-share-link  
**Version:** 0.0.2  
**Primary Purpose:** Generate shareable code links for GitHub and other git hosting services directly from VS Code

### Core Functionality
This VS Code extension allows developers to:
1. Generate shareable links to specific lines of code in their Git repositories
2. Copy these links to the clipboard automatically
3. Support multiple git hosting services (GitHub, GitLab, Bitbucket, etc.)
4. Choose between current branch or main branch for link generation
5. Configure the hosting service and default branch through settings

## Project Structure

```
/workspace/
├── src/
│   ├── extension.ts           # Main extension logic
│   └── test/
│       └── extension.test.ts  # Unit tests
├── out/                       # Compiled JavaScript output (generated)
├── package.json              # Extension manifest and dependencies
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration
├── README.md                 # User documentation
├── CHANGELOG.md              # Release notes and changes
├── vsc-extension-quickstart.md # VS Code extension development guide
├── Dockerfile.dev            # Development container setup
├── docker-compose.yaml       # Docker development environment
├── DOCKER_DEV_README.md      # Docker development documentation
└── LICENSE                   # Project license
```

## Key Files Deep Dive

### 1. `/workspace/package.json`
**Purpose:** Extension manifest file defining metadata, commands, keybindings, and dependencies

**Key Configuration:**
- **Extension ID:** `vscode-code-share-link`
- **VS Code Engine:** `^1.104.0`
- **Main Entry Point:** `./out/extension.js`

**Commands Defined:**
- `vscode-code-share-link.generateLink` - Generate link with current branch
- `vscode-code-share-link.generateLinkMain` - Generate link with main branch

**Keybindings:**
- `Ctrl+Shift+Alt+C` (Mac: `Cmd+Shift+Alt+C`) - Generate current branch link
- `Ctrl+Shift+Alt+M` (Mac: `Cmd+Shift+Alt+M`) - Generate main branch link

**Configuration Settings:**
- `codeShareLink.baseUrl` (default: "github.com") - Git hosting service URL
- `codeShareLink.defaultBranch` (default: "main") - Default branch for main branch links

**Build Scripts:**
- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode compilation
- `npm run test` - Run tests with linting (automatically uses xvfb-run for headless testing)
- `npm run test:headless` - Explicit headless testing with virtual display
- `npm run lint` - Run ESLint

### 2. `/workspace/src/extension.ts`
**Purpose:** Main extension implementation containing all core logic

**Key Functions:**

#### `activate(context: vscode.ExtensionContext)`
- Entry point called when extension is activated
- Registers command handlers for both link generation commands
- Sets up command subscriptions

#### `generateCodeLink(useMainBranch: boolean)`
**Core Logic Flow:**
1. Get active editor and current cursor position
2. Extract file path and line number (1-based)
3. Find workspace folder for the file
4. Read configuration settings (`baseUrl`, `defaultBranch`)
5. Execute Git commands to get repository information:
   - `git rev-parse --show-toplevel` - Get repository root
   - `git remote get-url origin` - Get remote URL
   - `git branch --show-current` - Get current branch (if not using main)
6. Parse repository URL using `parseRepositoryUrl()`
7. Generate shareable URL format: `https://{baseUrl}/{owner}/{repo}/blob/{branch}/{relativePath}#L{lineNumber}`
8. Copy to clipboard and show notification

#### `parseRepositoryUrl(url: string, baseUrl: string)`
**Purpose:** Parse both HTTPS and SSH Git URLs to extract owner and repository name

**Supported Formats:**
- HTTPS: `https://github.com/owner/repo.git` or `https://github.com/owner/repo`
- SSH: `git@github.com:owner/repo.git` or `git@github.com:owner/repo`

**Returns:** `{owner: string, repo: string}` or `null` if parsing fails

**Error Handling:**
- No active editor
- File not in workspace
- Not a Git repository
- No remote origin
- Unsupported hosting service
- Git command failures

### 3. `/workspace/src/test/extension.test.ts`
**Purpose:** Unit tests for the extension functionality

**Test Coverage:**
- URL parsing for various Git remote formats
- HTTPS and SSH URL formats
- With and without `.git` suffix
- Different hosting services (GitHub, GitLab)
- Invalid URL handling
- Wrong base URL handling

**Test Framework:** Mocha with VS Code test runner

## Development Environment

### TypeScript Configuration (`/workspace/tsconfig.json`)
- **Target:** ES2022
- **Module:** Node16
- **Output Directory:** `out/`
- **Source Directory:** `src/`
- **Source Maps:** Enabled
- **Strict Mode:** Enabled

### ESLint Configuration (`/workspace/eslint.config.mjs`)
- **Parser:** `@typescript-eslint/parser`
- **Plugins:** `@typescript-eslint/eslint-plugin`
- **Rules:** Naming conventions, curly braces, equality checks, semicolons

### Docker Development Environment
**Dockerfile.dev Features:**
- Ubuntu 24.04 base
- Node.js 20.x
- TypeScript, VS Code extension tools
- Xvfb for headless testing
- Extension development utilities (`yo`, `generator-code`, `vsce`)

**Docker Compose Setup:**
- Volume mounting for live development
- Port 5000 exposed for debugging
- Interactive terminal access
- Node modules isolation

## Commands and Usage

### Available Commands
1. **Generate Code Link** (`vscode-code-share-link.generateLink`)
   - Uses current Git branch
   - Keyboard: `Ctrl+Shift+Alt+C` / `Cmd+Shift+Alt+C`
   - Available in: Command palette, context menu

2. **Generate Code Link (Main Branch)** (`vscode-code-share-link.generateLinkMain`)
   - Uses configured default branch
   - Keyboard: `Ctrl+Shift+Alt+M` / `Cmd+Shift+Alt+M`
   - Available in: Command palette, context menu

### Development Commands
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Run tests
npm run test

# Lint code
npm run lint

# Package extension
vsce package
```

### Git Requirements
The extension requires:
- Git CLI available in PATH
- Active Git repository
- Remote origin configured
- Supported hosting service (configurable via `baseUrl` setting)

## Extension Settings

### User Configurable Settings
```json
{
  "codeShareLink.baseUrl": {
    "type": "string",
    "default": "github.com",
    "description": "Base URL for the git hosting service"
  },
  "codeShareLink.defaultBranch": {
    "type": "string", 
    "default": "main",
    "description": "Default branch name for main branch links"
  },
  "codeShareLink.showInContextMenu": {
    "type": "boolean",
    "default": true,
    "description": "Show 'Generate Code Link' command in the editor context menu"
  },
  "codeShareLink.showMainBranchInContextMenu": {
    "type": "boolean",
    "default": true,
    "description": "Show 'Generate Code Link (Main Branch)' command in the editor context menu"
  }
}
```

### Usage Examples
```json
// For GitLab
"codeShareLink.baseUrl": "gitlab.com"

// For Bitbucket
"codeShareLink.baseUrl": "bitbucket.org"

// For GitHub Enterprise
"codeShareLink.baseUrl": "github.company.com"

// Different default branch
"codeShareLink.defaultBranch": "master"

// Hide the regular command from context menu, keep only main branch command
"codeShareLink.showInContextMenu": false
"codeShareLink.showMainBranchInContextMenu": true

// Hide both commands from context menu (keyboard shortcuts still work)
"codeShareLink.showInContextMenu": false
"codeShareLink.showMainBranchInContextMenu": false
```

## Testing

### Test Execution
```bash
# Run all tests
npm run test

# Run with VS Code Test Runner extension
# 1. Install Extension Test Runner extension
# 2. Run "Tasks: Run Task" -> "watch"
# 3. Use Testing view in Activity Bar
```

### Test Coverage Areas
- Repository URL parsing (HTTPS/SSH formats)
- Multiple hosting services support
- Error handling for invalid URLs
- Branch and owner/repo extraction

### Adding New Tests
Tests should be added to `/workspace/src/test/extension.test.ts` following the Mocha test pattern:

```typescript
test('test description', () => {
    // Test implementation
    assert.strictEqual(actual, expected);
});
```

## Common Implementation Patterns

### Adding New Git Hosting Services
1. **Update `parseRepositoryUrl()` function** to handle new URL patterns
2. **Add test cases** for the new service URL formats
3. **Update documentation** to reflect supported services

### Adding New Commands
1. **Define command in `package.json`** under `contributes.commands`
2. **Add keybindings** in `contributes.keybindings` (optional)
3. **Register command handler** in `activate()` function
4. **Implement command logic** as separate function
5. **Add to context menu** in `contributes.menus` (optional)

### Error Handling Pattern
```typescript
try {
    // Git or file operations
    const result = await operation();
    // Success handling
} catch (error) {
    vscode.window.showErrorMessage(`Error message: ${error}`);
    return; // Early return on error
}
```

## Dependencies

### Runtime Dependencies
- **vscode**: VS Code extensibility API (dev dependency)
- **Node.js built-ins**: `path`, `child_process`, `util`

### Development Dependencies
- **TypeScript**: Language compilation
- **ESLint**: Code linting
- **Mocha**: Test framework
- **@vscode/test-cli**: VS Code testing tools
- **@vscode/test-electron**: Electron-based testing

### Optional Development Tools
- **vsce**: Extension packaging and publishing
- **yo generator-code**: Extension scaffolding

## Release and Versioning

### Current Version: 0.0.2
**Release Process:**
1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Commit changes
4. Package with `vsce package`
5. Publish with `vsce publish`

### Version History
- **0.0.1**: Initial release with basic GitHub link generation
- **0.0.2**: Added multi-service support, main branch command, configuration settings

## Troubleshooting Common Issues

### Extension Not Activating
- Check VS Code version compatibility (`engines.vscode` in package.json)
- Verify main entry point exists (`out/extension.js`)
- Check for compilation errors

### Git Commands Failing
- Ensure Git is installed and in PATH
- Verify file is in a Git repository
- Check if repository has remote origin configured

### URL Generation Issues
- Verify repository URL format matches supported patterns
- Check `baseUrl` configuration matches hosting service
- Ensure remote URL is accessible

### Testing Issues
- Ensure watch task is running (`npm run watch`)
- Install Extension Test Runner extension
- Check for TypeScript compilation errors
- **Linux/Docker environments**: Tests require X11 libraries and virtual display
  - Missing libraries error (`libnspr4.so`): Install required VS Code dependencies
  - Missing display error: Tests automatically use `xvfb-run` for headless testing
  - D-Bus warnings are normal in containerized environments and don't affect test results

## Future Enhancement Opportunities

### Potential Features
1. **Selection Support**: Generate links for code ranges/selections
2. **Custom URL Templates**: Allow custom URL format configuration
3. **Multiple Remote Support**: Handle repositories with multiple remotes
4. **Permalink Generation**: Generate permanent links using commit SHA
5. **Integration with Issue Trackers**: Direct integration with GitHub/GitLab issues
6. **Batch Link Generation**: Generate multiple links at once
7. **Link History**: Store and manage previously generated links

### Technical Improvements
1. **Bundle Extension**: Reduce startup time and size
2. **Add Integration Tests**: Test with real Git repositories
3. **Improve Error Messages**: More specific error guidance
4. **Add Telemetry**: Usage analytics for improvement
5. **Performance Optimization**: Cache Git repository information

## AI Agent Implementation Guidelines

When working on this extension, AI agents should:

1. **Maintain Backward Compatibility**: Ensure changes don't break existing functionality
2. **Follow VS Code UX Guidelines**: Keep consistent with VS Code patterns
3. **Test Thoroughly**: Add tests for new functionality
4. **Update Documentation**: Keep README.md and this file current
5. **Handle Errors Gracefully**: Provide helpful error messages
6. **Consider Performance**: Minimize Git command execution
7. **Follow TypeScript Best Practices**: Use strict typing and modern patterns

### Code Style Guidelines
- Use async/await for asynchronous operations
- Prefer explicit error handling over try-catch-all
- Use VS Code API consistently (window.showErrorMessage, etc.)
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Use meaningful variable and function names

This document should be updated whenever significant changes are made to the project structure, functionality, or development process.