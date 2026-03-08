"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function OpenClawPage() {
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
          <span className="text-4xl mb-4 block">🦞</span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            OpenClaw + Creddy
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure OpenClaw to use Creddy for secure credential management.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            OpenClaw is an AI agent framework that supports credential management out of the box. 
            With Creddy integration, your OpenClaw agents get their own identities and can request 
            scoped, short-lived credentials for external services.
          </p>

          <h2>Prerequisites</h2>
          <ul>
            <li>OpenClaw installed and running</li>
            <li>Creddy server running (locally or remote)</li>
            <li>Agent enrolled in Creddy</li>
          </ul>

          <h2>Configuration</h2>
          <p>Add the Creddy configuration to your OpenClaw config file:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# ~/.openclaw/config.yaml
credentials:
  provider: creddy
  server: http://localhost:8400
  agent_token: $CREDDY_AGENT_TOKEN`}</code>
          </pre>

          <h2>Environment Variables</h2>
          <p>Set your agent token as an environment variable:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`export CREDDY_AGENT_TOKEN="your-agent-token-here"`}</code>
          </pre>

          <h2>Usage</h2>
          <p>Once configured, OpenClaw will automatically use Creddy for credential requests:</p>

          <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
            <code>{`# OpenClaw will request credentials from Creddy automatically
openclaw run "Clone the repo and create a PR"

# Or explicitly request credentials in your agent code
creds = await creddy.get("github")`}</code>
          </pre>

          <h2>Supported Integrations</h2>
          <p>
            OpenClaw + Creddy supports all <Link href="/integrations" className="text-primary hover:underline">Creddy integrations</Link>:
          </p>
          <ul>
            <li>GitHub (installation tokens)</li>
            <li>OpenAI (API keys)</li>
            <li>Anthropic (API keys)</li>
            <li>And more...</li>
          </ul>

          <h2>Security Benefits</h2>
          <ul>
            <li><strong>No hardcoded secrets</strong> — credentials are fetched at runtime</li>
            <li><strong>Short-lived tokens</strong> — credentials expire automatically</li>
            <li><strong>Scoped access</strong> — agents only get the permissions they need</li>
            <li><strong>Audit trail</strong> — all credential requests are logged</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
