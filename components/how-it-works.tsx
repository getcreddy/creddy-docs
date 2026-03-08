"use client"

import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const bashCode = `# Authenticate (OAuth 2.0)
ACCESS_TOKEN=$(curl -s -X POST $CREDDY_URL/oauth/token \\
  -d "grant_type=client_credentials" \\
  -d "client_id=agent_f8e7d6" \\
  -d "client_secret=cks_xyz789" | jq -r .access_token)

# Get GitHub token
curl "$CREDDY_URL/v1/credentials/github" \\
  -H "Authorization: Bearer $ACCESS_TOKEN"
# → { "token": "ghs_xxxxx" }`

const nodeCode = `import { Issuer } from 'openid-client';

const issuer = await Issuer.discover(CREDDY_URL);
const client = new issuer.Client({
  client_id: 'agent_f8e7d6',
  client_secret: 'cks_xyz789',
});

// Get access token
const { access_token } = await client.grant({
  grant_type: 'client_credentials',
});

// Get GitHub token  
const res = await fetch(
  \`\${CREDDY_URL}/v1/credentials/github\`,
  { headers: { Authorization: \`Bearer \${access_token}\` } }
);
const { token } = await res.json();`

const steps = [
  {
    step: "01",
    title: "Create an agent identity",
    description:
      "Register each agent with scoped permissions. Creddy returns OIDC credentials — a client ID and secret unique to this agent.",
    code: `# Create an agent identity
creddy agent create agent-12345 \\
  --can github:myorg/* \\
  --can anthropic

# Returns OIDC credentials
{
  "client_id": "agent_f8e7d6",
  "client_secret": "cks_xyz789..."
}`,
  },
  {
    step: "03",
    title: "Proxy mode: your keys stay hidden",
    description:
      "For APIs without ephemeral keys (like Anthropic), agents call through Creddy's proxy. Your real API key never leaves the server.",
    code: `# Configure Claude Code to use Creddy
claude config set apiUrl \\
  "https://creddy.example.com/v1/proxy/anthropic"

claude config set apiKey "crd_xxx"

# Requests go through Creddy
# Your sk-ant-xxx stays on the server`,
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
          {/* Step 01 */}
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <span className="font-mono text-sm text-primary">01</span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {steps[0].title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {steps[0].description}
              </p>
            </div>
            <CodeBlock code={steps[0].code} />
          </div>

          {/* Step 02 - Vend mode with tabs */}
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <span className="font-mono text-sm text-primary">02</span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                Vend mode: get real tokens
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                For services like GitHub, Creddy issues real short-lived tokens.
                Authenticate with your client credentials, then request a token.
              </p>
            </div>
            <Tabs defaultValue="bash" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="bash">Bash</TabsTrigger>
                <TabsTrigger value="node">Node.js</TabsTrigger>
              </TabsList>
              <TabsContent value="bash">
                <CodeBlock code={bashCode} />
              </TabsContent>
              <TabsContent value="node">
                <CodeBlock code={nodeCode} lang="typescript" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Step 03 */}
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <span className="font-mono text-sm text-primary">03</span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {steps[1].title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {steps[1].description}
              </p>
            </div>
            <CodeBlock code={steps[1].code} />
          </div>
        </div>
      </div>
    </section>
  )
}
