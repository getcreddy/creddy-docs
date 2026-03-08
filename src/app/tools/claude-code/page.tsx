"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ClaudeCodePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Tools
        </Link>

        <div className="mb-8">
          <span className="text-4xl mb-4 block">🤖</span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Claude Code + Creddy
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure Claude Code to use Creddy for secure GitHub access.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Claude Code is Anthropic's agentic coding tool that can work with your codebase. 
            By integrating with Creddy, Claude Code can access GitHub repositories using 
            short-lived, scoped tokens instead of your personal access tokens.
          </p>

          <h2>Prerequisites</h2>
          <ul>
            <li>Claude Code installed (<code>npm install -g @anthropic-ai/claude-code</code>)</li>
            <li>Creddy server running with GitHub integration configured</li>
            <li>Agent enrolled in Creddy with GitHub scope</li>
          </ul>

          <h2>Configuration</h2>
          <p>
            Claude Code uses environment variables for GitHub authentication. 
            Configure it to fetch credentials from Creddy:
          </p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# Wrapper script: ~/bin/claude-code-creddy
#!/bin/bash

# Fetch GitHub token from Creddy
export GITHUB_TOKEN=$(creddy get github --format token)

# Run Claude Code with the token
exec claude-code "$@"`}</code>
          </pre>

          <p>Make it executable and use it instead of <code>claude-code</code>:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`chmod +x ~/bin/claude-code-creddy
alias claude-code="~/bin/claude-code-creddy"`}</code>
          </pre>

          <h2>Alternative: Shell Function</h2>
          <p>Or add this to your shell profile (<code>~/.zshrc</code> or <code>~/.bashrc</code>):</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`claude-code() {
  GITHUB_TOKEN=$(creddy get github --format token) \\
    command claude-code "$@"
}`}</code>
          </pre>

          <h2>How It Works</h2>
          <ol>
            <li>Before each Claude Code session, the wrapper fetches a fresh GitHub token</li>
            <li>Creddy generates a scoped installation token (valid for 1 hour)</li>
            <li>Claude Code uses this token for all GitHub operations</li>
            <li>Token expires automatically — no cleanup needed</li>
          </ol>

          <h2>Scoping Access</h2>
          <p>
            Configure which repositories Claude Code can access by setting scopes 
            on the agent in Creddy:
          </p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# Allow access to specific repos only
creddy agent update claude-code \\
  --scope "github:repo:myorg/myrepo" \\
  --scope "github:repo:myorg/another-repo"`}</code>
          </pre>

          <h2>Security Benefits</h2>
          <ul>
            <li><strong>Repository-scoped</strong> — Claude Code only accesses allowed repos</li>
            <li><strong>Time-limited</strong> — tokens expire in 1 hour</li>
            <li><strong>Auditable</strong> — every token request is logged</li>
            <li><strong>Revocable</strong> — unenroll the agent to revoke all access</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
