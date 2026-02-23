"use client"

import { useState } from "react"
import { Github, ArrowUpRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              href="https://agenticdevloop.com/guides/identity-secrets-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
            >
              Why?
              <ArrowUpRight className="size-3" />
            </a>
            <a
              href="#quickstart"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Quick Start
            </a>
            <a
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href="https://github.com/getcreddy/creddy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-3.5" />
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
              href="https://agenticdevloop.com/guides/identity-secrets-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why?
              <ArrowUpRight className="size-3" />
            </a>
            <a
              href="#quickstart"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Quick Start
            </a>
            <a
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
