import { notFound } from "next/navigation"
import { readFile } from "fs/promises"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import remarkGfm from "remark-gfm"

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
    options: { 
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: {
      h1: (props) => <h1 className="text-3xl font-bold tracking-tight mb-4" {...props} />,
      h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-4 pt-4 border-t border-border" {...props} />,
      h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
      h4: (props) => <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />,
      p: (props) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
      a: (props) => <a className="text-primary hover:underline" {...props} />,
      ul: (props) => <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1" {...props} />,
      ol: (props) => <ol className="list-decimal list-inside mb-4 text-muted-foreground space-y-1" {...props} />,
      li: (props) => <li className="leading-relaxed" {...props} />,
      strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
      em: (props) => <em {...props} />,
      code: (props) => {
        const isBlock = typeof props.children === 'string' && props.children.includes('\n')
        if (isBlock) {
          return <code className="block" {...props} />
        }
        return <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props} />
      },
      pre: (props) => (
        <pre className="bg-black border border-border rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono" {...props} />
      ),
      blockquote: (props) => (
        <blockquote className="border-l-4 border-primary/50 bg-primary/5 pl-4 pr-4 py-2 my-4 rounded-r" {...props} />
      ),
      table: (props) => (
        <div className="overflow-x-auto mb-6 rounded-lg border border-border">
          <table className="w-full text-sm" {...props} />
        </div>
      ),
      thead: (props) => <thead className="bg-secondary/50" {...props} />,
      tbody: (props) => <tbody className="divide-y divide-border" {...props} />,
      tr: (props) => <tr className="hover:bg-secondary/30 transition-colors" {...props} />,
      th: (props) => (
        <th className="text-left font-semibold px-4 py-3 text-foreground" {...props} />
      ),
      td: (props) => (
        <td className="px-4 py-3 text-muted-foreground" {...props} />
      ),
      hr: () => <hr className="border-border my-8" />,
    },
  })

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
          <article>
            {content}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
