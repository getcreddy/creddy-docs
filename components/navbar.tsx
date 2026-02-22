import { Github, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
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
      </nav>
    </header>
  )
}
