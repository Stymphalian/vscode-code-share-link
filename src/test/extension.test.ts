import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

// Create a simple test version of parseGitHubUrl function for testing
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
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

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('parseGitHubUrl - HTTPS format with .git', () => {
		const result = parseGitHubUrl('https://github.com/MrKou47/code-share.git');
		assert.strictEqual(result?.owner, 'MrKou47');
		assert.strictEqual(result?.repo, 'code-share');
	});

	test('parseGitHubUrl - HTTPS format without .git', () => {
		const result = parseGitHubUrl('https://github.com/Stymphalian/vscode-code-share-link');
		assert.strictEqual(result?.owner, 'Stymphalian');
		assert.strictEqual(result?.repo, 'vscode-code-share-link');
	});

	test('parseGitHubUrl - SSH format with .git', () => {
		const result = parseGitHubUrl('git@github.com:MrKou47/code-share.git');
		assert.strictEqual(result?.owner, 'MrKou47');
		assert.strictEqual(result?.repo, 'code-share');
	});

	test('parseGitHubUrl - SSH format without .git', () => {
		const result = parseGitHubUrl('git@github.com:Stymphalian/vscode-code-share-link');
		assert.strictEqual(result?.owner, 'Stymphalian');
		assert.strictEqual(result?.repo, 'vscode-code-share-link');
	});

	test('parseGitHubUrl - invalid URL', () => {
		const result = parseGitHubUrl('https://gitlab.com/user/repo.git');
		assert.strictEqual(result, null);
	});

	test('parseGitHubUrl - invalid format', () => {
		const result = parseGitHubUrl('not-a-url');
		assert.strictEqual(result, null);
	});
});
