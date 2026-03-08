import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

const integrations = {
  "AI & LLMs": [
    {
      name: "Anthropic",
      slug: "anthropic",
      description: "Claude API via proxy mode",
      version: "0.1.2",
      mode: "proxy",
    },
    {
      name: "OpenAI", 
      slug: "openai",
      description: "GPT API keys via Admin API",
      version: "0.0.1",
      mode: "vend",
    },
  ],
  "Source Control": [
    {
      name: "GitHub",
      slug: "github", 
      description: "App installation tokens",
      version: "0.2.1",
      mode: "vend",
    },
  ],
  "Cloud & Infrastructure": [
    {
      name: "AWS",
      slug: "aws",
      description: "STS credentials via OIDC federation",
      version: "soon",
      mode: "federation",
    },
    {
      name: "Tailscale",
      slug: "tailscale",
      description: "Auth keys for device registration", 
      version: "0.1.0",
      mode: "vend",
    },
    {
      name: "Daytona",
      slug: "daytona",
      description: "Workspace credentials",
      version: "0.1.1", 
      mode: "vend",
    },
  ],
  "Secrets & Config": [
    {
      name: "Doppler",
      slug: "doppler",
      description: "Scoped service tokens",
      version: "0.2.0",
      mode: "vend",
    },
  ],
  "Containers": [
    {
      name: "Docker Hub",
      slug: "dockerhub",
      description: "Registry access tokens",
      version: "0.1.0",
      mode: "vend",
    },
  ],
}

function ModeTag({ mode }: { mode: string }) {
  const styles = {
    vend: "bg-green-500/10 text-green-500 border-green-500/20",
    proxy: "bg-blue-500/10 text-blue-500 border-blue-500/20", 
    federation: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${styles[mode as keyof typeof styles] || styles.vend}`}>
      {mode}
    </span>
  )
}

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <p className="mb-3 font-mono text-sm text-primary">Integrations</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Connect to your services
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Each integration is a plugin. Install what you need, get credentials in seconds.
            </p>
          </div>

          <div className="mb-8 flex gap-4 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-green-500" /> Vend — real tokens
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-blue-500" /> Proxy — requests through Creddy
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-purple-500" /> Federation — OIDC direct
            </span>
          </div>

          {Object.entries(integrations).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-sm font-mono text-muted-foreground mb-4">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((integration) => (
                  <a
                    key={integration.slug}
                    href={`/docs/integrations/${integration.slug}`}
                    className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-card/80"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {integration.name}
                      </h3>
                      <ModeTag mode={integration.mode} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {integration.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        {integration.version === "soon" ? "Coming soon" : `v${integration.version}`}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-border bg-card/50 p-6 mt-8">
            <h3 className="font-semibold text-foreground mb-2">Build your own</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create custom integrations for internal services or unsupported platforms.
            </p>
            <a 
              href="/docs/integrations/building"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View plugin SDK docs
              <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
