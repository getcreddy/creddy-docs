import { notFound } from "next/navigation"
import { readFile } from "fs/promises"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TableOfContents } from "@/components/toc"
import { extractHeadings } from "@/lib/toc-utils"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
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

  const { content } = await compileMDX({
    source,
    options: { 
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, {
            theme: 'github-dark',
            keepBackground: true,
          }]
        ],
      },
    },
    components: {
      h1: (props) => (
        <h1 
          id={slugify(String(props.children))}
          style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--foreground)' }}
          {...props} 
        />
      ),
      h2: (props) => (
        <h2 
          id={slugify(String(props.children))}
          style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', lineHeight: 1.3, color: 'var(--foreground)', scrollMarginTop: '5rem' }}
          {...props} 
        />
      ),
      h3: (props) => (
        <h3 
          id={slugify(String(props.children))}
          style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', lineHeight: 1.4, color: 'var(--foreground)', scrollMarginTop: '5rem' }}
          {...props} 
        />
      ),
      h4: (props) => (
        <h4 
          style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}
          {...props} 
        />
      ),
      p: (props) => (
        <p 
          style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.25rem', color: 'var(--foreground)' }}
          {...props} 
        />
      ),
      a: (props) => (
        <a 
          style={{ color: 'var(--primary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          {...props} 
        />
      ),
      ul: (props) => (
        <ul 
          style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.75 }}
          {...props} 
        />
      ),
      ol: (props) => (
        <ol 
          style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.75 }}
          {...props} 
        />
      ),
      li: (props) => (
        <li 
          style={{ marginTop: '0.5rem', paddingLeft: '0.25rem' }}
          {...props} 
        />
      ),
      strong: (props) => (
        <strong 
          style={{ fontWeight: 600, color: 'var(--foreground)' }}
          {...props} 
        />
      ),
      em: (props) => <em {...props} />,
      code: (props: any) => {
        // Inline code (not inside pre)
        if (!props['data-language']) {
          return (
            <code 
              style={{ 
                backgroundColor: 'var(--secondary)', 
                padding: '0.125rem 0.375rem', 
                borderRadius: '0.25rem', 
                fontSize: '0.875rem', 
                fontFamily: 'ui-monospace, monospace',
                border: '1px solid var(--border)'
              }}
              {...props} 
            />
          )
        }
        // Code inside pre (handled by rehype-pretty-code)
        return (
          <code 
            style={{ 
              display: 'block',
              padding: '1rem 1.25rem',
            }}
            {...props} 
          />
        )
      },
      pre: (props: any) => {
        return (
          <pre 
            style={{ 
              backgroundColor: '#0d1117', 
              border: '1px solid var(--border)', 
              borderRadius: '0.5rem', 
              padding: 0,
              overflowX: 'auto', 
              marginBottom: '1.25rem', 
              fontSize: '0.875rem', 
              fontFamily: 'ui-monospace, monospace',
              lineHeight: 1.7,
              maxWidth: '100%'
            }}
            {...props} 
          />
        )
      },
      figure: (props: any) => {
        // rehype-pretty-code wraps code in figure
        if (props['data-rehype-pretty-code-figure'] !== undefined) {
          return <figure style={{ margin: 0, marginBottom: '1.25rem' }} {...props} />
        }
        return <figure {...props} />
      },
      blockquote: (props) => {
        // Check if this is a mode callout (Proxy Mode or Vend Mode)
        const content = String((props.children as any)?.props?.children || '')
        const isProxyMode = content.includes('Proxy Mode')
        const isVendMode = content.includes('Vend Mode')
        
        if (isProxyMode || isVendMode) {
          return (
            <div 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                marginBottom: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: isVendMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                border: `1px solid ${isVendMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              }}
            >
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{isVendMode ? '✅' : '⚠️'}</span>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <strong style={{ color: isVendMode ? 'rgb(34, 197, 94)' : 'rgb(234, 179, 8)' }}>
                  {isVendMode ? 'Vend Mode' : 'Proxy Mode'}
                </strong>
                <span style={{ color: 'var(--muted-foreground)', marginLeft: '0.5rem' }}>
                  {isVendMode 
                    ? 'Creddy creates real tokens. Agents use them directly with the provider API.'
                    : "This provider doesn't support ephemeral keys. Creddy proxies requests using your real key."}
                </span>
              </div>
            </div>
          )
        }
        
        return (
          <blockquote 
            style={{
              borderLeft: '4px solid var(--border)',
              paddingLeft: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              color: 'var(--muted-foreground)',
              fontStyle: 'italic'
            }}
            {...props} 
          />
        )
      },
      table: (props) => (
        <div style={{ overflowX: 'auto', marginTop: '1.5rem', marginBottom: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', fontSize: '0.875rem' }} {...props} />
        </div>
      ),
      thead: (props) => (
        <thead style={{ backgroundColor: 'var(--secondary)' }} {...props} />
      ),
      tbody: (props) => (
        <tbody {...props} />
      ),
      tr: (props) => (
        <tr style={{ borderBottom: '1px solid var(--border)' }} {...props} />
      ),
      th: (props) => (
        <th style={{ textAlign: 'left', fontWeight: 600, padding: '0.75rem 1rem', color: 'var(--foreground)' }} {...props} />
      ),
      td: (props) => (
        <td style={{ padding: '0.75rem 1rem' }} {...props} />
      ),
      hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginTop: '2rem', marginBottom: '2rem' }} />,
      img: (props: any) => (
        <img 
          {...props}
          className={props.className || ''}
          style={{ 
            width: '100%', 
            marginBottom: '1.5rem', 
            borderRadius: '0.5rem',
            ...props.style 
          }}
        />
      ),
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        .prose-container pre {
          padding: 0.625rem 0.875rem !important;
        }
        .prose-container figure pre {
          padding: 0.625rem 0.875rem !important;
        }
        .prose-container [data-rehype-pretty-code-figure] pre {
          padding: 0.625rem 0.875rem !important;
        }
        .prose-container code[data-theme] {
          padding: 0.625rem 0.875rem !important;
          display: block;
        }
        .diagram-invertible-wrapper {
          margin-bottom: 1.5rem;
        }
        .diagram-invertible-wrapper img {
          width: 100%;
          border-radius: 0.5rem;
        }
        .dark .diagram-invertible-wrapper img {
          filter: invert(1) hue-rotate(180deg);
        }
      `}</style>
      <Navbar />
      <main className="pt-32 pb-20 px-6">
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
            <aside style={{ width: 220, flexShrink: 0, paddingLeft: 24, borderLeft: '1px solid var(--border)' }}>
              <nav style={{ position: 'sticky', top: 96 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  On this page
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {headings.filter(h => h.level <= 2).map((h) => (
                    <li key={h.id} style={{ marginBottom: 8 }}>
                      <a 
                        href={`#${h.id}`} 
                        style={{ 
                          fontSize: 14, 
                          color: 'var(--muted-foreground)',
                          textDecoration: 'none',
                          display: 'block',
                          paddingLeft: h.level === 2 ? 0 : 12
                        }}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
