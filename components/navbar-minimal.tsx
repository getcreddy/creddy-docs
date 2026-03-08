"use client"

import { useState } from "react"
import { Github, ArrowUpRight, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const tools = [
  { name: "OpenClaw", slug: "openclaw", icon: "🦞" },
  { name: "Claude Code", slug: "claude-code", icon: "🤖" },
  { name: "Codex CLI", slug: "codex", icon: "⌨️" },
  { name: "OpenCode", slug: "opencode", icon: "💻" },
]

// Minimal navbar for home page - no theme toggle
export function NavbarMinimal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="font-mono text-sm font-semibold text-foreground tracking-tight"
          >
            creddy
          </a>
          {/* Desktop nav */}
          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="/integrations"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Integrations
            </a>
            
            {/* Tools dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <a
                href="/tools"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Tools
                <ChevronDown className="size-3" />
              </a>
              
              {toolsOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-md shadow-lg py-2 min-w-[200px]">
                    {tools.map((tool) => (
                      <a
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                      >
                        <span>{tool.icon}</span>
                        {tool.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <a
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
            <a
              href="https://agenticdevloop.com/guides/identity-secrets-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Why?
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <a
              href="https://github.com/getcreddy/creddy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-md sm:hidden">
          <div className="mx-auto max-w-5xl px-6 py-4 flex flex-col gap-4">
            <a
              href="/integrations"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Integrations
            </a>
            <a
              href="/tools"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </a>
            <div className="pl-4 flex flex-col gap-2">
              {tools.map((tool) => (
                <a
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </a>
              ))}
            </div>
            <a
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </a>
            <a
              href="https://agenticdevloop.com/guides/identity-secrets-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why?
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
