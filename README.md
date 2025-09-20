# VSCode Code Share Link

VSCode extension for generating and sharing code links for GitHub repositories.

## Features

This extension allows you to quickly generate GitHub links to specific lines of code in your repository and copy them to your clipboard.

### Generate GitHub Link

- Open any file in a Git repository that has a GitHub remote
- Place your cursor on the line you want to share
- Use the command "Generate GitHub Link" or press `Ctrl+Shift+C` (Cmd+Shift+C on Mac)
- The GitHub URL will be generated and copied to your clipboard
- A notification will show the generated link

### Example

If you're on line 105 of `src/extension.ts` in the repository `github.com/Stymphalian/vscode-code-share-link` on branch `main`, the extension will generate:

```
https://github.com/Stymphalian/vscode-code-share-link/blob/main/src/extension.ts#L105
```

## Usage

1. **Command Palette**: Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac) and type "Generate GitHub Link"
2. **Keyboard Shortcut**: Press `Ctrl+Shift+C` (Cmd+Shift+C on Mac) while in the editor
3. **Context Menu**: Right-click in the editor and select "Generate GitHub Link"

## Requirements

- Your file must be in a Git repository
- The repository must have a GitHub remote origin
- Git must be installed and accessible from the command line

## Extension Settings

This extension contributes the following settings:

* No additional settings required

## Known Issues

- Currently only supports GitHub repositories (not GitLab, Bitbucket, etc.)
- Requires Git command line tools to be available

## Release Notes

### 0.0.1

Initial release of VSCode Code Share Link extension

- Generate GitHub links for specific lines of code
- Copy links to clipboard
- Support for both HTTPS and SSH remote URLs
- Keyboard shortcut and context menu integration
