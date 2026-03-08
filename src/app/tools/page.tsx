"use client"

import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const tools = [
  {
    name: "OpenClaw",
    slug: "openclaw",
    description: "AI agent framework with built-in credential management",
    icon: "🦞",
  },
  {
    name: "Claude Code",
    slug: "claude-code",
    description: "Anthropic's agentic coding tool",
    icon: "🤖",
  },
  {
    name: "Codex CLI",
    slug: "codex",
    description: "OpenAI's terminal-based coding assistant",
    icon: "⌨️",
  },
  {
    name: "OpenCode",
    slug: "opencode",
    description: "Open source AI coding assistant",
    icon: "💻",
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Tool Configuration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn how to configure popular AI coding tools to use Creddy for 
            credential management. Each guide shows the specific configuration 
            needed for that tool.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block rounded-lg border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:bg-accent/50"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tool.icon}</span>
                <div>
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
