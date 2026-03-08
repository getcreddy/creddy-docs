"use client"

import { useState } from "react"
import { Github, ArrowUpRight, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DocsNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight"
          >
            creddy
          </a>
          {/* Desktop nav */}
          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="/integrations"
              className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Integrations
            </a>
            <a
              href="/docs"
              className="text-sm text-neutral-900 dark:text-neutral-100 font-medium"
            >
              Docs
            </a>
            <a
              href="https://agenticdevloop.com/guides/identity-secrets-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Why?
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          
          <a
            href="https://github.com/getcreddy/creddy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="size-9 inline-flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Github className="size-4 text-neutral-700 dark:text-neutral-300" />
          </a>
          
          {/* Mobile menu button */}
          <button
            className="sm:hidden size-9 inline-flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md sm:hidden">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-4">
            <a
              href="/integrations"
              className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Integrations
            </a>
            <a
              href="/docs"
              className="text-sm text-neutral-900 dark:text-neutral-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </a>
            <a
              href="https://agenticdevloop.com/guides/identity-secrets-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
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
