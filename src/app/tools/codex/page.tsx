"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CodexPage() {
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
          <span className="text-4xl mb-4 block">⌨️</span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Codex CLI + Creddy
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure OpenAI's Codex CLI to use Creddy for credentials.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Codex CLI is OpenAI's terminal-based coding assistant. It needs access to 
            both OpenAI's API and often GitHub for repository access. Creddy can provide 
            both credentials securely.
          </p>

          <h2>Prerequisites</h2>
          <ul>
            <li>Codex CLI installed</li>
            <li>Creddy server running with OpenAI and/or GitHub integrations</li>
            <li>Agent enrolled in Creddy with appropriate scopes</li>
          </ul>

          <h2>Configuration</h2>
          <p>Create a wrapper script that injects credentials from Creddy:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# ~/bin/codex-creddy
#!/bin/bash

# Fetch OpenAI API key from Creddy
export OPENAI_API_KEY=$(creddy get openai --format token)

# Optionally fetch GitHub token for repo access
export GITHUB_TOKEN=$(creddy get github --format token)

# Run Codex with the credentials
exec codex "$@"`}</code>
          </pre>

          <h2>Shell Integration</h2>
          <p>Add to your shell profile:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# ~/.zshrc or ~/.bashrc
codex() {
  OPENAI_API_KEY=$(creddy get openai --format token) \\
  GITHUB_TOKEN=$(creddy get github --format token) \\
    command codex "$@"
}`}</code>
          </pre>

          <h2>Why Use Creddy for OpenAI?</h2>
          <p>
            With the <Link href="/integrations/openai" className="text-primary hover:underline">OpenAI integration</Link>, 
            Creddy uses OpenAI's Admin API to create project-scoped API keys:
          </p>
          <ul>
            <li><strong>Project isolation</strong> — keys are scoped to specific projects</li>
            <li><strong>Usage tracking</strong> — each agent's usage is tracked separately</li>
            <li><strong>Automatic cleanup</strong> — keys are revoked when the agent is unenrolled</li>
            <li><strong>Rate limiting</strong> — set per-agent rate limits via OpenAI projects</li>
          </ul>

          <h2>Usage</h2>
          <p>Use Codex normally — credentials are injected automatically:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# Credentials are fetched automatically
codex "Add error handling to the API routes"

# Or for a specific task
codex --task "Refactor the auth module to use JWT"`}</code>
          </pre>

          <h2>Security Notes</h2>
          <ul>
            <li>OpenAI keys are project-scoped (not your main API key)</li>
            <li>GitHub tokens are repository-scoped and time-limited</li>
            <li>All credential requests are logged in Creddy</li>
            <li>Revoke access instantly by unenrolling the agent</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
