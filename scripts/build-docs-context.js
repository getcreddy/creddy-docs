#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../src/content');
const OUTPUT_FILE = path.join(__dirname, '../public/docs-context.txt');

function extractTextFromMdx(content) {
  // Remove imports
  content = content.replace(/^import\s+.*$/gm, '');
  // Remove JSX components but keep their text content
  content = content.replace(/<[^>]+>/g, '');
  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---/m, '');
  // Clean up extra whitespace
  content = content.replace(/\n{3,}/g, '\n\n');
  return content.trim();
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function buildContext() {
  const files = walkDir(CONTENT_DIR);
  let context = `# Creddy Documentation\n\nCreddy is an open source, self-hosted credential management system for AI agents. It provides ephemeral, scoped credentials that automatically expire.\n\n`;

  for (const file of files) {
    const relativePath = path.relative(CONTENT_DIR, file);
    const content = fs.readFileSync(file, 'utf-8');
    const text = extractTextFromMdx(content);
    
    if (text.length > 0) {
      context += `\n---\n## ${relativePath}\n\n${text}\n`;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, context);
  console.log(`Built docs context: ${OUTPUT_FILE} (${(context.length / 1024).toFixed(1)}KB)`);
}

buildContext();
