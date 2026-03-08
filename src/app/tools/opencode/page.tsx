"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function OpenCodePage() {
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
          <span className="text-4xl mb-4 block">💻</span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            OpenCode + Creddy
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure OpenCode to use Creddy for secure credential management.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            OpenCode is an open source AI coding assistant that runs in your terminal. 
            Integrate it with Creddy to give it secure, scoped access to your 
            development resources.
          </p>

          <h2>Prerequisites</h2>
          <ul>
            <li>OpenCode installed (<code>go install github.com/opencode-ai/opencode@latest</code>)</li>
            <li>Creddy server running</li>
            <li>Agent enrolled in Creddy</li>
          </ul>

          <h2>Configuration</h2>
          <p>OpenCode supports configuration via environment variables or a config file:</p>

          <h3>Environment Variables</h3>
          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# Shell function that injects credentials
opencode() {
  export ANTHROPIC_API_KEY=$(creddy get anthropic --format token)
  export OPENAI_API_KEY=$(creddy get openai --format token)
  export GITHUB_TOKEN=$(creddy get github --format token)
  command opencode "$@"
}`}</code>
          </pre>

          <h3>Config File</h3>
          <p>Alternatively, configure OpenCode to use a credential helper:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# ~/.opencode/config.yaml
credentials:
  anthropic:
    command: creddy get anthropic --format token
  openai:
    command: creddy get openai --format token
  github:
    command: creddy get github --format token`}</code>
          </pre>

          <h2>Multiple Model Support</h2>
          <p>
            OpenCode supports multiple LLM providers. With Creddy, you can give it 
            access to any combination:
          </p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# Enroll the agent with multiple scopes
creddy agent create opencode \\
  --scope "anthropic" \\
  --scope "openai" \\
  --scope "github:repo:myorg/*"`}</code>
          </pre>

          <h2>Usage</h2>
          <p>Run OpenCode normally — credentials are fetched on demand:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# Start an interactive session
opencode

# Or run a specific task
opencode "Add tests for the user service"`}</code>
          </pre>

          <h2>Self-Hosted Models</h2>
          <p>
            If you're using self-hosted models (Ollama, vLLM, etc.), you may not need 
            Creddy for the LLM. But you can still use it for GitHub and other services:
          </p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`opencode() {
  # Only inject GitHub credentials, use local model
  export GITHUB_TOKEN=$(creddy get github --format token)
  export OPENCODE_MODEL="ollama/codellama"
  command opencode "$@"
}`}</code>
          </pre>

          <h2>Security Benefits</h2>
          <ul>
            <li><strong>Credential isolation</strong> — each tool gets its own credentials</li>
            <li><strong>Short-lived tokens</strong> — API keys and tokens expire automatically</li>
            <li><strong>Audit logging</strong> — track which credentials OpenCode requested</li>
            <li><strong>Easy rotation</strong> — rotate backend credentials without updating OpenCode</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
