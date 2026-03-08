"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  lang?: string
}

function highlightLine(line: string, lang: string) {
  // Comment lines
  if (line.trimStart().startsWith("#") || line.trimStart().startsWith("//")) {
    return <span className="text-muted-foreground">{line}</span>
  }

  // For JSON-like content
  if (lang === "json" || line.trimStart().startsWith("{") || line.trimStart().startsWith('"')) {
    return <span className="text-muted-foreground">{line}</span>
  }

  const parts: React.ReactNode[] = []
  let remaining = line
  let key = 0

  // JS/TS keywords
  if (lang === "typescript" || lang === "javascript") {
    const keywords = /\b(import|from|const|let|var|await|async|new|return)\b/g
    remaining = remaining.replace(keywords, '\x01kw\x02$1\x03')
  }

  // Highlight command names for bash
  if (lang === "bash" || lang === "shell") {
    const cmdMatch = remaining.match(/^(export |)(creddy|git|curl|docker|npm|pnpm|claude|aws)/)
    if (cmdMatch) {
      if (cmdMatch[1]) {
        parts.push(<span key={key++} className="text-primary">{cmdMatch[1]}</span>)
      }
      parts.push(<span key={key++} className="text-foreground font-semibold">{cmdMatch[2]}</span>)
      remaining = remaining.slice(cmdMatch[0].length)
    }

    // Highlight flags
    remaining = remaining.replace(/(--?\w[\w-]*)/g, '\x01flag\x02$1\x03')
  }

  // Highlight strings
  remaining = remaining.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '\x01str\x02$1\x03')

  const tokens = remaining.split(/(\x01\w+\x02[^\x03]*\x03)/)
  for (const token of tokens) {
    const kwMatch = token.match(/\x01kw\x02([^\x03]*)\x03/)
    if (kwMatch) {
      parts.push(<span key={key++} className="text-primary">{kwMatch[1]}</span>)
      continue
    }
    const flagMatch = token.match(/\x01flag\x02([^\x03]*)\x03/)
    if (flagMatch) {
      parts.push(<span key={key++} className="text-muted-foreground">{flagMatch[1]}</span>)
      continue
    }
    const strMatch = token.match(/\x01str\x02([^\x03]*)\x03/)
    if (strMatch) {
      parts.push(<span key={key++} className="text-green-400">{strMatch[1]}</span>)
      continue
    }
    if (token) {
      parts.push(<span key={key++}>{token}</span>)
    }
  }

  return <>{parts}</>
}

export function CodeBlock({ code, lang = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const lines = code.split("\n")

  const handleCopy = () => {
    const cleanCode = lines
      .filter((l) => !l.trimStart().startsWith("#") && !l.trimStart().startsWith("//"))
      .join("\n")
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-secondary/50">
      <div className="flex items-center justify-end border-b border-border px-4 py-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line, lang)}</div>
          ))}
        </code>
      </pre>
    </div>
  )
}
