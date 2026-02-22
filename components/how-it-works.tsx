import { CodeBlock } from "@/components/code-block"

const steps = [
  {
    step: "01",
    title: "Create an agent identity",
    description:
      "Register each agent with its own scoped permissions. Creddy generates a unique API key and optional GPG signing key.",
    code: `# Create an agent identity
creddy agent create deploy-bot --can github
# → ckr_abc123...`,
  },
  {
    step: "02",
    title: "Agent requests credentials",
    description:
      "When the agent needs access, it authenticates with its key and requests an ephemeral token scoped to the service it needs.",
    code: `# Agent requests ephemeral token
export CREDDY_TOKEN=ckr_abc123
creddy get github --ttl 10m
# → ghs_xxxxx (expires in 10 minutes)`,
  },
  {
    step: "03",
    title: "Token expires automatically",
    description:
      "Tokens are short-lived by default. Every request is logged. The agent never sees your master credentials.",
    code: `# Full audit trail
creddy audit list --agent deploy-bot
# → 2024-01-15 14:23  github  ghs_xxxxx  expired
# → 2024-01-15 14:33  github  ghs_yyyyy  expired`,
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-sm text-primary">How it works</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to secure agent credentials
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {steps.map((step) => (
            <div
              key={step.step}
              className="grid items-start gap-8 lg:grid-cols-2"
            >
              <div>
                <span className="font-mono text-sm text-primary">
                  {step.step}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <CodeBlock code={step.code} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
