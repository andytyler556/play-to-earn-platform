#!/usr/bin/env node

/**
 * Security Check Script for P2E Gaming Platform
 *
 * This script performs security checks before commits to prevent
 * accidental exposure of sensitive data.
 *
 * Usage: node scripts/security-check.js
 * Or as a pre-commit hook
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns that indicate sensitive data
const SENSITIVE_PATTERNS = [
  // Private keys and mnemonics
  /[a-f0-9]{64}/gi, // 64-char hex strings (private keys)
  /\b[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+\b/gi, // 12-word mnemonics

  // API keys and secrets
  /api[_-]?key[_-]?[=:]\s*['"]*[a-z0-9]{20,}['"]*$/gmi,
  /secret[_-]?key[_-]?[=:]\s*['"]*[a-z0-9]{20,}['"]*$/gmi,
  /password[_-]?[=:]\s*['"]*[a-z0-9]{8,}['"]*$/gmi,

  // Stacks addresses (but allow examples)
  /ST[A-Z0-9]{39}/g,
  /SP[A-Z0-9]{39}/g,

  // Common secret patterns
  /-----BEGIN [A-Z ]+-----/,
  /-----END [A-Z ]+-----/,
];

// Files to exclude from scanning
const EXCLUDED_FILES = [
  '.git/',
  'node_modules/',
  '.next/',
  'dist/',
  'build/',
  '.env.example',
  '.env.testnet.example',
  '.env.production.example',
  'SECURITY.md',
  'scripts/security-check.js',
  'package-lock.json', // Contains dependency metadata, not secrets
  'yarn.lock'
];

// Allowed example values that look like secrets but aren't
const ALLOWED_EXAMPLES = [
  'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA', // Example testnet address
  'SP_YOUR_MAINNET_ADDRESS',
  'YOUR_ADDRESS',
  'your-mnemonic-here',
  'your-private-key-here',
  'your-api-key-here',
  'vessel alert business involve shoulder punch rescue stem charge peanut gentle cup omit dragon clerk tumble sight toast false milk obtain curious fatal toss',
  // Mock data addresses for development
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
  'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335'
];

/**
 * Check if a file should be excluded from scanning
 */
function shouldExcludeFile(filePath) {
  return EXCLUDED_FILES.some(excluded => filePath.includes(excluded));
}

/**
 * Check if a potential secret is actually an allowed example
 */
function isAllowedExample(content, match) {
  return ALLOWED_EXAMPLES.some(example =>
    content.includes(example) && match.includes(example)
  );
}

/**
 * Scan a file for sensitive data
 */
function scanFile(filePath) {
  const issues = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineNumber) => {
      SENSITIVE_PATTERNS.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Skip if it's an allowed example
            if (isAllowedExample(content, match)) {
              return;
            }

            // Skip if it's in a comment explaining the pattern
            if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('*')) {
              return;
            }

            // Skip if it's in mock data or test files
            if (filePath.includes('mock') || filePath.includes('test') || filePath.includes('spec')) {
              return;
            }

            // Skip if it's a description or UI text
            if (line.includes('description:') || line.includes('Purchase unique land')) {
              return;
            }

            issues.push({
              file: filePath,
              line: lineNumber + 1,
              match: match,
              context: line.trim()
            });
          });
        }
      });
    });
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
  }

  return issues;
}

/**
 * Get list of files to scan
 */
function getFilesToScan() {
  try {
    // Get all tracked files in git
    const gitFiles = execSync('git ls-files', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.trim() !== '');

    // Also check staged files
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.trim() !== '');

    // Combine and deduplicate
    const allFiles = [...new Set([...gitFiles, ...stagedFiles])];

    // Filter out excluded files
    return allFiles.filter(file => !shouldExcludeFile(file));
  } catch (error) {
    console.warn('Warning: Could not get git files, scanning current directory');

    // Fallback: scan current directory
    const files = [];
    function scanDir(dir) {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !shouldExcludeFile(fullPath)) {
          scanDir(fullPath);
        } else if (stat.isFile() && !shouldExcludeFile(fullPath)) {
          files.push(fullPath);
        }
      });
    }

    scanDir('.');
    return files;
  }
}

/**
 * Check environment variable naming
 */
function checkEnvironmentVariables() {
  const issues = [];

  // Check for sensitive data in NEXT_PUBLIC_ variables
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      const value = process.env[key];

      // Check if the variable name suggests sensitive data
      const sensitiveNames = ['key', 'secret', 'password', 'mnemonic', 'private'];
      const hasSensitiveName = sensitiveNames.some(name =>
        key.toLowerCase().includes(name)
      );

      if (hasSensitiveName) {
        issues.push({
          type: 'environment',
          message: `Potentially sensitive data in public environment variable: ${key}`,
          suggestion: 'Remove NEXT_PUBLIC_ prefix for sensitive data'
        });
      }
    }
  });

  return issues;
}

/**
 * Main security check function
 */
function performSecurityCheck() {
  console.log('🔍 Running security checks...\n');

  let totalIssues = 0;

  // 1. Scan files for sensitive data
  console.log('📁 Scanning files for sensitive data...');
  const filesToScan = getFilesToScan();
  const fileIssues = [];

  filesToScan.forEach(file => {
    const issues = scanFile(file);
    fileIssues.push(...issues);
  });

  if (fileIssues.length > 0) {
    console.log(`❌ Found ${fileIssues.length} potential security issues in files:\n`);

    fileIssues.forEach(issue => {
      console.log(`  📄 ${issue.file}:${issue.line}`);
      console.log(`     🔍 Found: ${issue.match}`);
      console.log(`     📝 Context: ${issue.context}`);
      console.log('');
    });

    totalIssues += fileIssues.length;
  } else {
    console.log('✅ No sensitive data found in files');
  }

  // 2. Check environment variables
  console.log('\n🌍 Checking environment variables...');
  const envIssues = checkEnvironmentVariables();

  if (envIssues.length > 0) {
    console.log(`❌ Found ${envIssues.length} environment variable issues:\n`);

    envIssues.forEach(issue => {
      console.log(`  ⚠️  ${issue.message}`);
      console.log(`     💡 Suggestion: ${issue.suggestion}`);
      console.log('');
    });

    totalIssues += envIssues.length;
  } else {
    console.log('✅ Environment variables look secure');
  }

  // 3. Check .gitignore
  console.log('\n📝 Checking .gitignore...');
  const gitignorePath = path.join(__dirname, '../.gitignore');

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const requiredPatterns = ['.env', '.env.*', '*.key', 'secrets/', 'private-keys/'];
    const missingPatterns = requiredPatterns.filter(pattern =>
      !gitignoreContent.includes(pattern)
    );

    if (missingPatterns.length > 0) {
      console.log(`❌ Missing patterns in .gitignore: ${missingPatterns.join(', ')}`);
      totalIssues += missingPatterns.length;
    } else {
      console.log('✅ .gitignore includes security patterns');
    }
  } else {
    console.log('❌ .gitignore file not found');
    totalIssues += 1;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (totalIssues === 0) {
    console.log('🎉 Security check passed! No issues found.');
    return true;
  } else {
    console.log(`🚨 Security check failed! Found ${totalIssues} issues.`);
    console.log('\n💡 How to fix:');
    console.log('  1. Remove sensitive data from source code');
    console.log('  2. Use environment variables for secrets');
    console.log('  3. Add sensitive files to .gitignore');
    console.log('  4. Use NEXT_PUBLIC_ only for non-sensitive data');
    console.log('\n📖 See SECURITY.md for detailed guidelines');
    return false;
  }
}

// Run security check if called directly
if (require.main === module) {
  const passed = performSecurityCheck();
  process.exit(passed ? 0 : 1);
}

module.exports = { performSecurityCheck };
