import { AlertTriangle, ShieldOff, Eye, ArrowRight } from "lucide-react"

const problems = [
  {
    icon: ShieldOff,
    title: "Overprivileged agents",
    description:
      "Agents get your personal tokens with full access. A single compromised agent exposes everything.",
  },
  {
    icon: Eye,
    title: "No visibility",
    description:
      "No way to know which agent used which credential, when, or what it did. Auditing is impossible.",
  },
  {
    icon: AlertTriangle,
    title: "Credentials never expire",
    description:
      "Long-lived PATs and API keys sit in .env files and agent configs indefinitely. Rotation is manual.",
  },
]

export function Problem() {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-sm text-primary">The problem</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Credential management for agents is broken
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            You wouldn&apos;t hand an intern your root SSH key. Why give an AI agent
            your personal access tokens?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <problem.icon className="mb-4 size-5 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">
                {problem.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Guide callout */}
        <a
          href="https://agenticdevloop.com/guides/identity-secrets-trust"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-5 transition-colors hover:border-primary/40 hover:bg-primary/10"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-primary/70">
              The Agentic Dev Loop
            </span>
            <span className="text-base font-semibold text-foreground">
              Identity, Secrets & Trust Boundaries
            </span>
            <span className="text-sm text-muted-foreground">
              A deep dive into why agents need their own identity, scoped
              credentials, and trust zones.
            </span>
          </div>
          <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  )
}
