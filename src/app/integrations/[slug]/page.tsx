import { notFound } from "next/navigation"
import { readFile } from "fs/promises"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const integrations: Record<string, { name: string; mode: string }> = {
  anthropic: { name: "Anthropic", mode: "proxy" },
  openai: { name: "OpenAI", mode: "vend" },
  github: { name: "GitHub", mode: "vend" },
  doppler: { name: "Doppler", mode: "vend" },
  tailscale: { name: "Tailscale", mode: "vend" },
  daytona: { name: "Daytona", mode: "vend" },
  dockerhub: { name: "Docker Hub", mode: "vend" },
  replicated: { name: "Replicated", mode: "vend" },
  building: { name: "Building Integrations", mode: "sdk" },
}

export async function generateStaticParams() {
  return Object.keys(integrations).map((slug) => ({ slug }))
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  if (!integrations[slug]) {
    notFound()
  }

  const filePath = path.join(process.cwd(), "src/content/integrations", `${slug}.mdx`)
  
  let source: string
  try {
    source = await readFile(filePath, "utf-8")
  } catch {
    notFound()
  }

  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
    components: {
      h1: (props) => <h1 className="text-3xl font-bold tracking-tight mb-4" {...props} />,
      h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-4 pt-4 border-t border-border" {...props} />,
      h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
      p: (props) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
      a: (props) => <a className="text-primary hover:underline" {...props} />,
      ul: (props) => <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1" {...props} />,
      ol: (props) => <ol className="list-decimal list-inside mb-4 text-muted-foreground space-y-1" {...props} />,
      li: (props) => <li className="leading-relaxed" {...props} />,
      code: (props) => <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
      pre: (props) => <pre className="bg-secondary/50 border border-border rounded-lg p-4 overflow-x-auto mb-4 text-sm" {...props} />,
      blockquote: (props) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4" {...props} />,
      table: (props) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm" {...props} /></div>,
      th: (props) => <th className="text-left font-semibold p-2 border-b border-border" {...props} />,
      td: (props) => <td className="p-2 border-b border-border text-muted-foreground" {...props} />,
      hr: () => <hr className="border-border my-8" />,
    },
  })

  const info = integrations[slug]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <a 
              href="/integrations" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Integrations
            </a>
          </div>
          <article className="prose-custom">
            {content}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
