# VSCode Code Share Link

VSCode extension for generating and sharing code links for GitHub repositories.

> **Note:** This repository was primarily created using AI assistance to demonstrate VSCode extension development capabilities.

## Features

This extension allows you to quickly Copy Code Links to specific lines of code in your repository and copy them to your clipboard.

### Copy Code Link

- Open any file in a Git repository that has a remote hosting service
- Place your cursor on the line you want to share
- Use the command "Copy Code Link" or press `Ctrl+Shift+Alt+C` (`Cmd+Shift+Alt+C` on Mac)
- Use "Copy Code Link (Main)" or press `Ctrl+Shift+Alt+M` (`Cmd+Shift+Alt+M` on Mac) to always link to the main branch
- Use "Copy Code Link (Hash)" to create a permalink using the current commit hash
- The URL will be generated and copied to your clipboard
- A notification will show the generated link

### Example

If you're on line 105 of `src/extension.ts` in the repository `github.com/Stymphalian/vscode-code-share-link` on branch `main`, the extension will generate:

**Current branch link:**
```
https://github.com/Stymphalian/vscode-code-share-link/blob/main/src/extension.ts#L105
```

**Hash-based permalink:**
```
https://github.com/Stymphalian/vscode-code-share-link/blob/abc123def456/src/extension.ts#L105
```

## Usage

1. **Command Palette**: Press `Ctrl+Shift+P` (`Cmd+Shift+P` on Mac) and type "Copy Code Link"
2. **Keyboard Shortcuts**: 
   - `Ctrl+Shift+Alt+C` (`Cmd+Shift+Alt+C` on Mac) - Copy link with current branch
   - `Ctrl+Shift+Alt+M` (`Cmd+Shift+Alt+M` on Mac) - Copy link with main branch
3. **Context Menu**: Right-click in the editor and select "Copy Code Link" or "Copy Code Link (Main)"
4. **Hash-based Permalinks**: Use "Copy Code Link (Hash)" from the Command Palette to generate links using commit hash (no keyboard shortcut or context menu)

## Requirements

- Your file must be in a Git repository
- The repository must have a remote origin (GitHub, GitLab, Bitbucket, etc.)
- Git must be installed and accessible from the command line

## Extension Settings

This extension contributes the following settings:

* `codeShareLink.baseUrl`: Base URL for the git hosting service (default: `github.com`)
* `codeShareLink.defaultBranch`: Default branch name to use when generating main branch links (default: `main`)
* `codeShareLink.showInContextMenu`: Show 'Copy Code Link' command in the editor context menu (default: `true`)
* `codeShareLink.showMainBranchInContextMenu`: Show 'Copy Code Link (Main)' command in the editor context menu (default: `true`)

### Configuration Examples

```json
{
  // Use GitLab instead of GitHub
  "codeShareLink.baseUrl": "gitlab.com",
  
  // Use 'master' as the default branch
  "codeShareLink.defaultBranch": "master",
  
  // Hide the regular command from context menu
  "codeShareLink.showInContextMenu": false,
  
  // Keep only the main branch command in context menu
  "codeShareLink.showMainBranchInContextMenu": true
}
```

## Known Issues

- Requires Git command line tools to be available