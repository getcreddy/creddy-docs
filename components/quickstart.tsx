import { CodeBlock } from "@/components/code-block"

const quickstartCode = `# Install and start Creddy
curl -fsSL https://get.creddy.dev/install.sh | sh
creddy server

# Create an agent identity
creddy agent create agent-12345 --can github:myorg/*
# → client_id: agent_f8e7d6
# → client_secret: cks_xyz789...

# Agent gets credentials (CLI)
export CREDDY_URL=http://localhost:8400
export CREDDY_CLIENT_ID=agent_f8e7d6
export CREDDY_CLIENT_SECRET=cks_xyz789

creddy get github --ttl 10m
# → ghs_xxxxx (expires in 10 minutes)`

export function Quickstart() {
  return (
    <section id="quickstart" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-sm text-primary">Quick start</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Up and running in seconds
          </h2>
          <p className="mt-4 text-muted-foreground">
            Single binary. No Docker required. No external services.
          </p>
        </div>

        <CodeBlock code={quickstartCode} />
      </div>
    </section>
  )
}
