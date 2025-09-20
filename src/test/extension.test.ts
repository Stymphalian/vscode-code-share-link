import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as extension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('parseRepositoryUrl - GitHub HTTPS format with .git', () => {
		const result = extension.parseRepositoryUrl('https://github.com/MrKou47/code-share.git', 'github.com');
		assert.strictEqual(result?.owner, 'MrKou47');
		assert.strictEqual(result?.repo, 'code-share');
	});

	test('parseRepositoryUrl - GitHub HTTPS format without .git', () => {
		const result = extension.parseRepositoryUrl('https://github.com/Stymphalian/vscode-code-share-link', 'github.com');
		assert.strictEqual(result?.owner, 'Stymphalian');
		assert.strictEqual(result?.repo, 'vscode-code-share-link');
	});

	test('parseRepositoryUrl - GitHub SSH format with .git', () => {
		const result = extension.parseRepositoryUrl('git@github.com:MrKou47/code-share.git', 'github.com');
		assert.strictEqual(result?.owner, 'MrKou47');
		assert.strictEqual(result?.repo, 'code-share');
	});

	test('parseRepositoryUrl - GitHub SSH format without .git', () => {
		const result = extension.parseRepositoryUrl('git@github.com:Stymphalian/vscode-code-share-link', 'github.com');
		assert.strictEqual(result?.owner, 'Stymphalian');
		assert.strictEqual(result?.repo, 'vscode-code-share-link');
	});

	test('parseRepositoryUrl - GitLab HTTPS format', () => {
		const result = extension.parseRepositoryUrl('https://gitlab.com/user/project.git', 'gitlab.com');
		assert.strictEqual(result?.owner, 'user');
		assert.strictEqual(result?.repo, 'project');
	});

	test('parseRepositoryUrl - GitLab SSH format', () => {
		const result = extension.parseRepositoryUrl('git@gitlab.com:user/project.git', 'gitlab.com');
		assert.strictEqual(result?.owner, 'user');
		assert.strictEqual(result?.repo, 'project');
	});

	test('parseRepositoryUrl - wrong baseUrl', () => {
		const result = extension.parseRepositoryUrl('https://github.com/user/repo.git', 'gitlab.com');
		assert.strictEqual(result, null);
	});

	test('parseRepositoryUrl - invalid format', () => {
		const result = extension.parseRepositoryUrl('not-a-url', 'github.com');
		assert.strictEqual(result, null);
	});

	test('generateLineReference - single line', () => {
		const result = extension.generateLineReference(42, 42);
		assert.strictEqual(result, '#L42');
	});

	test('generateLineReference - line range', () => {
		const result = extension.generateLineReference(10, 20);
		assert.strictEqual(result, '#L10-L20');
	});

	test('generateLineReference - large line numbers', () => {
		const result = extension.generateLineReference(1000, 1500);
		assert.strictEqual(result, '#L1000-L1500');
	});

	test('generateLineReference - adjacent lines', () => {
		const result = extension.generateLineReference(5, 6);
		assert.strictEqual(result, '#L5-L6');
	});

	test('generateRepositoryUrl - GitHub single line', () => {
		const repoInfo = { owner: 'testowner', repo: 'testrepo' };
		const result = extension.generateRepositoryUrl('github.com', repoInfo, 'main', 'src/test.js', 42, 42);
		assert.strictEqual(result, 'https://github.com/testowner/testrepo/blob/main/src/test.js#L42');
	});

	test('generateRepositoryUrl - GitHub line range', () => {
		const repoInfo = { owner: 'testowner', repo: 'testrepo' };
		const result = extension.generateRepositoryUrl('github.com', repoInfo, 'main', 'src/test.js', 10, 20);
		assert.strictEqual(result, 'https://github.com/testowner/testrepo/blob/main/src/test.js#L10-L20');
	});

	test('generateRepositoryUrl - GitLab single line', () => {
		const repoInfo = { owner: 'gitlabuser', repo: 'project' };
		const result = extension.generateRepositoryUrl('gitlab.com', repoInfo, 'develop', 'lib/utils.py', 15, 15);
		assert.strictEqual(result, 'https://gitlab.com/gitlabuser/project/blob/develop/lib/utils.py#L15');
	});

	test('generateRepositoryUrl - GitLab line range', () => {
		const repoInfo = { owner: 'gitlabuser', repo: 'project' };
		const result = extension.generateRepositoryUrl('gitlab.com', repoInfo, 'feature-branch', 'docs/README.md', 5, 8);
		assert.strictEqual(result, 'https://gitlab.com/gitlabuser/project/blob/feature-branch/docs/README.md#L5-L8');
	});

	test('generateRepositoryUrl - Bitbucket single line', () => {
		const repoInfo = { owner: 'bbuser', repo: 'repository' };
		const result = extension.generateRepositoryUrl('bitbucket.org', repoInfo, 'main', 'config/settings.json', 1, 1);
		assert.strictEqual(result, 'https://bitbucket.org/bbuser/repository/blob/main/config/settings.json#L1');
	});

	test('generateRepositoryUrl - GitHub Enterprise', () => {
		const repoInfo = { owner: 'enterprise-user', repo: 'enterprise-repo' };
		const result = extension.generateRepositoryUrl('github.company.com', repoInfo, 'master', 'enterprise/code.ts', 100, 100);
		assert.strictEqual(result, 'https://github.company.com/enterprise-user/enterprise-repo/blob/master/enterprise/code.ts#L100');
	});

	test('generateRepositoryUrl - nested path', () => {
		const repoInfo = { owner: 'user', repo: 'repo' };
		const result = extension.generateRepositoryUrl('github.com', repoInfo, 'main', 'deep/nested/folder/file.js', 25, 30);
		assert.strictEqual(result, 'https://github.com/user/repo/blob/main/deep/nested/folder/file.js#L25-L30');
	});

	test('generateRepositoryUrl - special characters in branch name', () => {
		const repoInfo = { owner: 'user', repo: 'repo' };
		const result = extension.generateRepositoryUrl('github.com', repoInfo, 'feature/fix-bug-123', 'src/app.js', 50, 50);
		assert.strictEqual(result, 'https://github.com/user/repo/blob/feature/fix-bug-123/src/app.js#L50');
	});

	test('generateRepositoryUrl - large line numbers', () => {
		const repoInfo = { owner: 'user', repo: 'repo' };
		const result = extension.generateRepositoryUrl('github.com', repoInfo, 'main', 'large-file.txt', 9999, 10001);
		assert.strictEqual(result, 'https://github.com/user/repo/blob/main/large-file.txt#L9999-L10001');
	});
});
