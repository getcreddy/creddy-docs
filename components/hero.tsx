import Image from "next/image"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-16 lg:pt-36 lg:pb-20">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left: text content */}
        <div className="flex flex-1 flex-col items-start text-left">
          <Badge
            variant="outline"
            className="mb-6 border-border text-muted-foreground font-mono text-xs tracking-wide"
          >
            Open Source &middot; Apache 2.0 Licensed
          </Badge>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Stop sharing your keys with AI agents
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Creddy is a self-hosted identity service that issues ephemeral, scoped
            credentials to AI agents. Your master secrets are never shared with the agent.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 font-medium">
              <a
                href="https://github.com/getcreddy/creddy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                View on GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-mono text-sm"
            >
              <a href="#quickstart">{'$ creddy get github'}</a>
            </Button>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="relative flex-1 lg:flex lg:justify-end">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md xl:max-w-lg">
            <div
              className="pointer-events-none absolute -inset-8 z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 35%, var(--background) 70%)",
              }}
            />
            <Image
              src="/images/hero-key.jpg"
              alt="Geometric key symbolizing secure credential management"
              width={1024}
              height={1024}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
