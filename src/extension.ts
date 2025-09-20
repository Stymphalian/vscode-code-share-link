// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-code-share-link" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable1 = vscode.commands.registerCommand('vscode-code-share-link.generateLink', async () => {
		try {
			await generateCodeLink(false);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to generate code link: ${error}`);
		}
	});

	const disposable2 = vscode.commands.registerCommand('vscode-code-share-link.generateLinkMain', async () => {
		try {
			await generateCodeLink(true);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to generate code link: ${error}`);
		}
	});

	context.subscriptions.push(disposable1, disposable2);
}

async function generateCodeLink(useMainBranch: boolean = false): Promise<void> {
	// Get the active editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found');
		return;
	}

	// Get current file path and line number(s)
	const document = editor.document;
	const filePath = document.fileName;
	
	// Handle both single cursor position and selections
	const selection = editor.selection;
	const startLine = selection.start.line + 1; // VSCode uses 0-based line numbers
	const endLine = selection.end.line + 1;

	// Get workspace folder
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('File is not in a workspace');
		return;
	}

	// Get configuration settings
	const config = vscode.workspace.getConfiguration('codeShareLink');
	const baseUrl = config.get<string>('baseUrl', 'github.com');
	const defaultBranch = config.get<string>('defaultBranch', 'main');

	try {
		// Get git repository root
		const { stdout: gitRoot } = await execAsync('git rev-parse --show-toplevel', { 
			cwd: workspaceFolder.uri.fsPath 
		});
		const repoRoot = gitRoot.trim();

		// Get remote URL
		const { stdout: remoteUrl } = await execAsync('git remote get-url origin', { 
			cwd: repoRoot 
		});
		const cleanRemoteUrl = remoteUrl.trim();

		// Parse repository URL
		const repoInfo = parseRepositoryUrl(cleanRemoteUrl, baseUrl);
		if (!repoInfo) {
			vscode.window.showErrorMessage(`Not a ${baseUrl} repository`);
			return;
		}

		// Determine branch to use
		let branch: string;
		if (useMainBranch) {
			branch = defaultBranch;
		} else {
			// Get current branch
			try {
				const { stdout: currentBranch } = await execAsync('git branch --show-current', { 
					cwd: repoRoot 
				});
				branch = currentBranch.trim();
			} catch {
				// Fallback for older git versions or detached HEAD
				try {
					const { stdout: symbolicRef } = await execAsync('git symbolic-ref --short HEAD', { 
						cwd: repoRoot 
					});
					branch = symbolicRef.trim();
				} catch {
					branch = defaultBranch; // Default fallback
				}
			}
		}

		// Get relative path from repo root
		const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

		// Generate repository URL
		const repoUrl = generateRepositoryUrl(baseUrl, repoInfo, branch, relativePath, startLine, endLine);

		// Copy to clipboard
		await vscode.env.clipboard.writeText(repoUrl);

		// Show success message that auto-disappears after 3 seconds
		const branchNote = useMainBranch ? ` (${defaultBranch} branch)` : '';
		// vscode.window.showInformationMessage(`Code link copied to clipboard${branchNote}: ${repoUrl}`, { modal: false });
		vscode.window.setStatusBarMessage(`Code link copied to clipboard${branchNote}: ${repoUrl}`, 3000);

	} catch (error) {
		vscode.window.showErrorMessage(`Git operation failed: ${error}`);
	}
}

export function generateRepositoryUrl(
	baseUrl: string,
	repoInfo: RepositoryInfo,
	branch: string,
	relativePath: string,
	startLine: number,
	endLine: number
): string {
	const lineReference = generateLineReference(startLine, endLine);
	return `https://${baseUrl}/${repoInfo.owner}/${repoInfo.repo}/blob/${branch}/${relativePath}${lineReference}`;
}

export function generateLineReference(startLine: number, endLine: number): string {
	if (startLine === endLine) {
		return `#L${startLine}`;
	} else {
		return `#L${startLine}-L${endLine}`;
	}
}

export interface RepositoryInfo {
	owner: string;
	repo: string;
}

export function parseRepositoryUrl(url: string, baseUrl: string): RepositoryInfo | null {
	// Handle both HTTPS and SSH URLs for different services
	// HTTPS: https://github.com/owner/repo.git, https://gitlab.com/owner/repo.git
	// SSH: git@github.com:owner/repo.git, git@gitlab.com:owner/repo.git
	
	let match;
	
	// Escape dots in baseUrl for regex
	const escapedBaseUrl = baseUrl.replace(/\./g, '\\.');
	
	// Try HTTPS format
	match = url.match(new RegExp(`https://${escapedBaseUrl}/([^/]+)/([^/]+?)(?:\\.git)?$`));
	if (match) {
		return { owner: match[1], repo: match[2] };
	}
	
	// Try SSH format
	match = url.match(new RegExp(`git@${escapedBaseUrl}:([^/]+)/([^/]+?)(?:\\.git)?$`));
	if (match) {
		return { owner: match[1], repo: match[2] };
	}
	
	return null;
}

// This method is called when your extension is deactivated
export function deactivate() {}
