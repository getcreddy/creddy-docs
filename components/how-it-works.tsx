import { CodeBlock } from "@/components/code-block"

const steps = [
  {
    step: "01",
    title: "Create an agent identity",
    description:
      "Register each agent with scoped permissions. Creddy returns OIDC credentials — a client ID and secret unique to this agent.",
    code: `# Create an agent identity
creddy agent create agent-12345 \\
  --can github:myorg/*

# Returns OIDC credentials
{
  "client_id": "agent_f8e7d6",
  "client_secret": "cks_xyz789..."
}`,
  },
  {
    step: "02",
    title: "Agent authenticates via OIDC",
    description:
      "The agent exchanges its credentials for a signed JWT. Standard OAuth 2.0 client credentials flow.",
    code: `# Get access token (OAuth 2.0)
curl -X POST https://creddy.example.com/oauth/token \\
  -d "grant_type=client_credentials" \\
  -d "client_id=$CLIENT_ID" \\
  -d "client_secret=$CLIENT_SECRET"

# → { "access_token": "eyJhbG...", ... }`,
  },
  {
    step: "03",
    title: "Exchange for service credentials",
    description:
      "Use the access token to request short-lived credentials. Token expires automatically — no cleanup needed.",
    code: `# Get GitHub token (10 min TTL)
curl "https://creddy.example.com/v1/credentials/github?ttl=10m" \\
  -H "Authorization: Bearer $ACCESS_TOKEN"

# → { "token": "ghs_xxxxx", "expires_at": "..." }`,
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
