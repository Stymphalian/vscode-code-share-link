# Local Installation Instructions

This guide explains how to package and manually install the VSCode Code Share Link extension on your local VS Code instance.

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Installed with Node.js
- **VS Code**: Version 1.104.0 or higher
- **Git**: For repository operations

## Step 1: Prepare the Extension

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Compile the Extension
```bash
npm run compile
```

This compiles the TypeScript source code to JavaScript in the `out/` directory.

### 1.3 Run Tests (Optional but Recommended)
```bash
npm run test
```

## Step 2: Package the Extension

### 2.1 Install VSCE (if not already installed)
```bash
npm install -g @vscode/vsce
```

### 2.2 Package the Extension
```bash
vsce package
```

This creates a `.vsix` file (e.g., `vscode-code-share-link-0.0.2.vsix`) in the project root directory.

**Note**: The packaging process may show warnings about file count and bundling. These warnings don't prevent installation but are recommendations for production releases.

## Step 3: Install the Extension in VS Code

You have three methods to install the packaged extension:

### Method 1: Command Palette (Recommended)
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the Command Palette
3. Type "Extensions: Install from VSIX..." and select it
4. Navigate to your project directory and select the `.vsix` file
5. Click "Install"
6. Reload VS Code when prompted

### Method 2: Extensions View
1. Open VS Code
2. Click the Extensions icon in the Activity Bar (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Click the "..." (Views and More Actions) menu at the top of the Extensions view
4. Select "Install from VSIX..."
5. Choose your `.vsix` file
6. Click "Install"
7. Reload VS Code when prompted

### Method 3: Command Line (if VS Code CLI is available)
```bash
code --install-extension ./vscode-code-share-link-0.0.2.vsix
```

## Step 4: Verify Installation

After installation and reloading VS Code:

1. **Check Extensions List**: Go to Extensions view and search for "vscode-code-share-link"
2. **Test Commands**: 
   - Press `Ctrl+Shift+P` and type "Copy Code Link" to see the available commands
   - Open a file in a Git repository and try the keyboard shortcuts:
     - `Ctrl+Shift+Alt+C` (or `Cmd+Shift+Alt+C` on Mac) - Copy Code Link
     - `Ctrl+Shift+Alt+M` (or `Cmd+Shift+Alt+M` on Mac) - Copy Code Link (Main)
3. **Context Menu**: Right-click in an editor to see the "Copy Code Link" options

## Configuration

The extension can be configured through VS Code settings:

```json
{
  "codeShareLink.baseUrl": "github.com",
  "codeShareLink.defaultBranch": "main",
  "codeShareLink.showInContextMenu": true,
  "codeShareLink.showMainBranchInContextMenu": true
}
```

### Supported Git Hosting Services
- GitHub (github.com) - Default
- GitLab (gitlab.com)
- Bitbucket (bitbucket.org)
- GitHub Enterprise (your-company.github.com)
- Any custom Git hosting service

To use a different service, update the `baseUrl` setting:
```json
{
  "codeShareLink.baseUrl": "gitlab.com"
}
```

## Uninstalling

To remove the extension:
1. Go to Extensions view in VS Code
2. Find "vscode-code-share-link"
3. Click the gear icon and select "Uninstall"

## Troubleshooting

### Common Issues

**Extension not appearing after installation:**
- Make sure VS Code was reloaded after installation
- Check the Extensions view to confirm installation
- Look for any error messages in the Developer Console (`Help > Toggle Developer Tools`)

**Commands not working:**
- Ensure you're in a Git repository
- Verify the file is tracked by Git
- Check that the repository has a remote origin configured

**Git-related errors:**
- Ensure Git is installed and available in your system PATH
- Verify the repository has a valid remote origin
- Check that your hosting service URL matches the `baseUrl` setting

**Packaging errors:**
- Run `npm run compile` to ensure TypeScript compilation succeeds
- Check that all dependencies are installed with `npm install`
- Verify you have the latest version of `@vscode/vsce`

### Getting Help

If you encounter issues:
1. Check the VS Code Developer Console for error messages
2. Verify your Git repository setup
3. Review the extension settings
4. Try packaging and installing again with a fresh compilation

## Development Workflow

For development and testing:

1. **Watch Mode**: Run `npm run watch` to automatically recompile on changes
2. **Debug**: Use F5 in VS Code to launch an Extension Development Host
3. **Package**: Use `vsce package` to create new `.vsix` files for testing
4. **Test**: Run `npm run test` to ensure functionality

## Files Generated

After packaging, you'll have:
- `vscode-code-share-link-X.X.X.vsix` - The installable extension package
- `out/` directory - Compiled JavaScript files

The `.vsix` file is self-contained and can be shared with others or installed on multiple machines.