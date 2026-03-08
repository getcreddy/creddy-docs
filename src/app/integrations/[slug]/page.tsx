import { notFound } from "next/navigation"
import { readFile } from "fs/promises"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TableOfContents } from "@/components/toc"
import { extractHeadings } from "@/lib/toc-utils"
import remarkGfm from "remark-gfm"
import React from "react"

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

// Helper to generate ID from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Check if content looks like an ASCII diagram
function isAsciiDiagram(content: string): boolean {
  // ASCII diagrams typically have box-drawing chars or multiple lines with arrows
  const hasBoxChars = /[┌┐└┘│─┬┴├┤┼▲▼◀▶═║╔╗╚╝╠╣╬]/.test(content)
  const hasAsciiBoxes = /[+\-|].*[+\-|]/.test(content)
  const hasArrows = /[◀▶▲▼<>→←↑↓]|[-─=]{2,}>|<[-─=]{2,}/.test(content)
  const multiLine = content.split('\n').length > 3
  
  return multiLine && (hasBoxChars || (hasAsciiBoxes && hasArrows))
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

  const filePath = path.join(process.cwd(), "content/integrations", `${slug}.mdx`)
  
  let source: string
  try {
    source = await readFile(filePath, "utf-8")
  } catch {
    notFound()
  }

  // Extract headings for TOC
  const headings = extractHeadings(source)
  console.log('TOC headings:', headings.length, headings.slice(0, 3))

  const { content } = await compileMDX({
    source,
    options: { 
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: {
      h1: (props) => (
        <h1 
          id={slugify(String(props.children))}
          className="text-3xl font-bold tracking-tight mb-6 text-foreground" 
          {...props} 
        />
      ),
      h2: (props) => (
        <h2 
          id={slugify(String(props.children))}
          className="text-2xl font-semibold mt-12 mb-4 pt-6 border-t border-border text-foreground scroll-mt-24" 
          {...props} 
        />
      ),
      h3: (props) => (
        <h3 
          id={slugify(String(props.children))}
          className="text-xl font-semibold mt-8 mb-3 text-foreground scroll-mt-24" 
          {...props} 
        />
      ),
      h4: (props) => (
        <h4 
          className="text-lg font-semibold mt-6 mb-2 text-foreground" 
          {...props} 
        />
      ),
      p: (props) => (
        <p 
          className="text-muted-foreground leading-7 mb-4" 
          {...props} 
        />
      ),
      a: (props) => (
        <a 
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors" 
          {...props} 
        />
      ),
      ul: (props) => (
        <ul 
          className="list-disc list-outside ml-6 mb-4 text-muted-foreground space-y-2" 
          {...props} 
        />
      ),
      ol: (props) => (
        <ol 
          className="list-decimal list-outside ml-6 mb-4 text-muted-foreground space-y-2" 
          {...props} 
        />
      ),
      li: (props) => (
        <li 
          className="leading-7 pl-1" 
          {...props} 
        />
      ),
      strong: (props) => (
        <strong 
          className="font-semibold text-foreground" 
          {...props} 
        />
      ),
      em: (props) => <em {...props} />,
      code: (props) => {
        const content = String(props.children || '')
        const isBlock = content.includes('\n')
        
        if (isBlock) {
          return <code className="block text-sm" {...props} />
        }
        return (
          <code 
            className="bg-secondary/80 dark:bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-foreground border border-border/50" 
            {...props} 
          />
        )
      },
      pre: (props) => {
        // Check if this is an ASCII diagram based on content
        const content = React.isValidElement(props.children) 
          ? String((props.children as any)?.props?.children || '')
          : String(props.children || '')
        
        const isDiagram = isAsciiDiagram(content)
        
        if (isDiagram) {
          return (
            <div className="my-6 rounded-lg border border-border bg-muted/30 dark:bg-muted/50 overflow-x-auto">
              <pre 
                className="p-4 text-xs sm:text-sm font-mono text-foreground leading-tight whitespace-pre overflow-x-auto"
                style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
                {...props} 
              />
            </div>
          )
        }
        
        return (
          <pre 
            className="bg-zinc-950 dark:bg-zinc-900 border border-border rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono leading-relaxed"
            style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
            {...props} 
          />
        )
      },
      blockquote: (props) => (
        <blockquote 
          className="border-l-4 border-primary/50 bg-primary/5 dark:bg-primary/10 pl-4 pr-4 py-3 my-6 rounded-r text-muted-foreground [&>p]:mb-0" 
          {...props} 
        />
      ),
      table: (props) => (
        <div className="overflow-x-auto my-6 rounded-lg border border-border">
          <table className="w-full text-sm" {...props} />
        </div>
      ),
      thead: (props) => (
        <thead className="bg-secondary/50 dark:bg-secondary" {...props} />
      ),
      tbody: (props) => (
        <tbody className="divide-y divide-border" {...props} />
      ),
      tr: (props) => (
        <tr className="hover:bg-secondary/30 dark:hover:bg-secondary/50 transition-colors" {...props} />
      ),
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
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <a 
              href="/integrations" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              ← Back to Integrations
            </a>
          </div>
          
          <div className="flex gap-12">
            {/* Main content */}
            <article className="min-w-0 flex-1 max-w-3xl">
              <div className="prose-container">
                {content}
              </div>
            </article>
            
            {/* Table of Contents */}
            <aside className="w-64 shrink-0 bg-red-500 p-4">
              <p className="text-white font-bold">TOC DEBUG - {headings.length} headings</p>
              {headings.slice(0, 5).map((h) => (
                <p key={h.id} className="text-white text-sm">{h.text}</p>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
