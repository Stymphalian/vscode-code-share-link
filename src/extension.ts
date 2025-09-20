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
	const disposable = vscode.commands.registerCommand('vscode-code-share-link.generateLink', async () => {
		try {
			await generateGitHubLink();
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to generate GitHub link: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

async function generateGitHubLink(): Promise<void> {
	// Get the active editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found');
		return;
	}

	// Get current file path and line number
	const document = editor.document;
	const filePath = document.fileName;
	const currentLine = editor.selection.active.line + 1; // VSCode uses 0-based line numbers

	// Get workspace folder
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('File is not in a workspace');
		return;
	}

	try {
		// Get git repository root
		const { stdout: gitRoot } = await execAsync('git rev-parse --show-toplevel', { 
			cwd: workspaceFolder.uri.fsPath 
		});
		const repoRoot = gitRoot.trim();

		// Get GitHub remote URL
		const { stdout: remoteUrl } = await execAsync('git remote get-url origin', { 
			cwd: repoRoot 
		});
		const cleanRemoteUrl = remoteUrl.trim();

		// Parse GitHub URL
		const githubInfo = parseGitHubUrl(cleanRemoteUrl);
		if (!githubInfo) {
			vscode.window.showErrorMessage('Not a GitHub repository');
			return;
		}

		// Get current branch
		let branch: string;
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
				branch = 'main'; // Default fallback
			}
		}

		// Get relative path from repo root
		const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

		// Generate GitHub URL
		const githubUrl = `https://github.com/${githubInfo.owner}/${githubInfo.repo}/blob/${branch}/${relativePath}#L${currentLine}`;

		// Copy to clipboard
		await vscode.env.clipboard.writeText(githubUrl);

		// Show success message
		vscode.window.showInformationMessage(`GitHub link copied to clipboard: ${githubUrl}`);

	} catch (error) {
		vscode.window.showErrorMessage(`Git operation failed: ${error}`);
	}
}

interface GitHubInfo {
	owner: string;
	repo: string;
}

function parseGitHubUrl(url: string): GitHubInfo | null {
	// Handle both HTTPS and SSH URLs
	// HTTPS: https://github.com/owner/repo.git
	// SSH: git@github.com:owner/repo.git
	
	let match;
	
	// Try HTTPS format
	match = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/);
	if (match) {
		return { owner: match[1], repo: match[2] };
	}
	
	// Try SSH format
	match = url.match(/git@github\.com:([^\/]+)\/([^\/]+?)(?:\.git)?$/);
	if (match) {
		return { owner: match[1], repo: match[2] };
	}
	
	return null;
}

// This method is called when your extension is deactivated
export function deactivate() {}
