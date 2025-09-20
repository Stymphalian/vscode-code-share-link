import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

// Create a simple test version of parseRepositoryUrl function for testing
function parseRepositoryUrl(url: string, baseUrl: string): { owner: string; repo: string } | null {
	// Handle both HTTPS and SSH URLs for different services
	
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

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('parseRepositoryUrl - GitHub HTTPS format with .git', () => {
		const result = parseRepositoryUrl('https://github.com/MrKou47/code-share.git', 'github.com');
		assert.strictEqual(result?.owner, 'MrKou47');
		assert.strictEqual(result?.repo, 'code-share');
	});

	test('parseRepositoryUrl - GitHub HTTPS format without .git', () => {
		const result = parseRepositoryUrl('https://github.com/Stymphalian/vscode-code-share-link', 'github.com');
		assert.strictEqual(result?.owner, 'Stymphalian');
		assert.strictEqual(result?.repo, 'vscode-code-share-link');
	});

	test('parseRepositoryUrl - GitHub SSH format with .git', () => {
		const result = parseRepositoryUrl('git@github.com:MrKou47/code-share.git', 'github.com');
		assert.strictEqual(result?.owner, 'MrKou47');
		assert.strictEqual(result?.repo, 'code-share');
	});

	test('parseRepositoryUrl - GitHub SSH format without .git', () => {
		const result = parseRepositoryUrl('git@github.com:Stymphalian/vscode-code-share-link', 'github.com');
		assert.strictEqual(result?.owner, 'Stymphalian');
		assert.strictEqual(result?.repo, 'vscode-code-share-link');
	});

	test('parseRepositoryUrl - GitLab HTTPS format', () => {
		const result = parseRepositoryUrl('https://gitlab.com/user/project.git', 'gitlab.com');
		assert.strictEqual(result?.owner, 'user');
		assert.strictEqual(result?.repo, 'project');
	});

	test('parseRepositoryUrl - GitLab SSH format', () => {
		const result = parseRepositoryUrl('git@gitlab.com:user/project.git', 'gitlab.com');
		assert.strictEqual(result?.owner, 'user');
		assert.strictEqual(result?.repo, 'project');
	});

	test('parseRepositoryUrl - wrong baseUrl', () => {
		const result = parseRepositoryUrl('https://github.com/user/repo.git', 'gitlab.com');
		assert.strictEqual(result, null);
	});

	test('parseRepositoryUrl - invalid format', () => {
		const result = parseRepositoryUrl('not-a-url', 'github.com');
		assert.strictEqual(result, null);
	});
});
