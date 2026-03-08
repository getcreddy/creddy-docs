import { CodeBlock } from "@/components/code-block"

const steps = [
  {
    step: "01",
    title: "Create an agent identity",
    description:
      "Register each agent with scoped permissions. Creddy acts as an OIDC provider — agents get verifiable identities, not shared secrets.",
    code: `# Create an agent identity
creddy agent create deploy-bot \\
  --can github:myorg/*`,
  },
  {
    step: "02",
    title: "Agent authenticates via OIDC",
    description:
      "The agent authenticates and receives a signed JWT. Services can verify the token directly or exchange it for credentials.",
    code: `# Get OIDC token
TOKEN=$(creddy get token)

# Token contains identity claims
{
  "sub": "agent:deploy-bot",
  "iss": "https://creddy.example.com",
  "scope": "github:myorg/*",
  "exp": 1709856000
}`,
  },
  {
    step: "03",
    title: "Exchange for service credentials",
    description:
      "For services that support OIDC (AWS, GCP), federate directly. For others, Creddy exchanges identity for short-lived credentials.",
    code: `# Federate directly with AWS
aws sts assume-role-with-web-identity \\
  --role-arn arn:aws:iam::123:role/agent \\
  --web-identity-token "$TOKEN"

# Or get service credentials
creddy get github --ttl 10m
# → ghs_xxxxx (expires in 10 minutes)`,
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-sm text-primary">How it works</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Identity first, credentials second
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
