import { Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-foreground tracking-tight">
            creddy
          </span>
          <Badge
            variant="outline"
            className="border-border text-muted-foreground text-xs"
          >
            Apache 2.0
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/getcreddy/creddy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
            GitHub
          </a>
          <a
            href="https://creddy.dev"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            creddy.dev
          </a>
        </div>
      </div>
    </footer>
  )
}
