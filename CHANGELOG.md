# Change Log

All notable changes to the "vscode-code-share-link" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.2] - 2024-09-20

### Changed
- Changed keyboard shortcut from `Ctrl+Shift+C` to `Ctrl+Shift+Alt+C` (`Cmd+Shift+Alt+C` on Mac)
- Renamed command from "Generate GitHub Link" to "Generate Code Link"
- Extended support to multiple git hosting services (GitHub, GitLab, Bitbucket, etc.)

### Added
- New command "Generate Code Link (Main Branch)" with keyboard shortcut `Ctrl+Shift+Alt+M` (`Cmd+Shift+Alt+M` on Mac)
- Extension settings:
  - `codeShareLink.baseUrl`: Configure base URL for git hosting service (default: github.com)
  - `codeShareLink.defaultBranch`: Configure default branch name (default: main)
- Support for flexible URL generation based on configuration
- AI development note in README

## [0.0.1] - 2024-09-20

### Added
- Initial release of VSCode Code Share Link extension
- Generate code links for specific lines of code
- Copy links to clipboard automatically
- Support for both HTTPS and SSH remote URLs
- Keyboard shortcut `Ctrl+Shift+C` (`Cmd+Shift+C` on Mac)
- Context menu integration
- Command palette integration with "Generate Code Link" command
- Automatic detection of Git repository, branch, and remote URL
- Error handling for non-Git repositories and non-GitHub remotes