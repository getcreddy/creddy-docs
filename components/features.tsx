import {
  Timer,
  Shield,
  Fingerprint,
  FileText,
  Server,
  Database,
} from "lucide-react"

const features = [
  {
    icon: Fingerprint,
    title: "OIDC provider",
    description:
      "Standard OpenID Connect. Agents authenticate and get signed JWTs. Federate with AWS, GCP, and any OIDC-compatible service.",
  },
  {
    icon: Timer,
    title: "Ephemeral credentials",
    description:
      "Tokens expire automatically with configurable TTL. Default is 10 minutes. No stale secrets.",
  },
  {
    icon: Shield,
    title: "Agent isolation",
    description:
      "Each agent gets its own identity and scoped permissions. Agents never see master secrets or each other's credentials.",
  },
  {
    icon: FileText,
    title: "Full audit trail",
    description:
      "Every credential request is logged with agent identity, service, timestamp, and expiration. Complete visibility.",
  },
  {
    icon: Server,
    title: "Single binary",
    description:
      "One binary, SQLite storage, zero external dependencies. Runs on your infrastructure, Tailscale-friendly.",
  },
  {
    icon: Database,
    title: "Multi-backend",
    description:
      "GitHub, Anthropic, OpenAI, Doppler, and more. For services without OIDC, Creddy exchanges identity for credentials.",
  },
]

export function Features() {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-sm text-primary">Features</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for production
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <feature.icon className="mb-4 size-5 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
