"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

function highlightLine(line: string) {
  // Comment lines
  if (line.trimStart().startsWith("#")) {
    return <span className="text-muted-foreground">{line}</span>
  }
  // Output lines (starting with # →)
  if (line.trimStart().startsWith("# →")) {
    return <span className="text-muted-foreground italic">{line}</span>
  }

  // Keyword highlighting for commands
  const parts: React.ReactNode[] = []
  let remaining = line
  let key = 0

  // Highlight the command name
  const cmdMatch = remaining.match(
    /^(export |)(creddy|git|curl|docker|npm|pnpm)/
  )
  if (cmdMatch) {
    if (cmdMatch[1]) {
      parts.push(
        <span key={key++} className="text-primary">
          {cmdMatch[1]}
        </span>
      )
    }
    parts.push(
      <span key={key++} className="text-foreground font-semibold">
        {cmdMatch[2]}
      </span>
    )
    remaining = remaining.slice(cmdMatch[0].length)
  }

  // Highlight flags
  remaining = remaining.replace(/(--?\w[\w-]*)/g, (match) => {
    return `\x01flag\x02${match}\x03`
  })

  // Highlight strings/values after =
  remaining = remaining.replace(/(=)(\S+)/g, (_, eq, val) => {
    return `${eq}\x01val\x02${val}\x03`
  })

  const tokens = remaining.split(/(\x01\w+\x02[^\x03]*\x03)/)
  for (const token of tokens) {
    const flagMatch = token.match(/\x01flag\x02([^\x03]*)\x03/)
    if (flagMatch) {
      parts.push(
        <span key={key++} className="text-muted-foreground">
          {flagMatch[1]}
        </span>
      )
      continue
    }
    const valMatch = token.match(/\x01val\x02([^\x03]*)\x03/)
    if (valMatch) {
      parts.push(
        <span key={key++} className="text-primary">
          {valMatch[1]}
        </span>
      )
      continue
    }
    if (token) {
      parts.push(<span key={key++}>{token}</span>)
    }
  }

  return <>{parts}</>
}

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const lines = code.split("\n")

  const handleCopy = () => {
    const cleanCode = lines
      .filter((l) => !l.trimStart().startsWith("#"))
      .join("\n")
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-secondary/50">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
        </div>
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
        <code className="font-mono" style={{ fontFamily: "var(--font-jetbrains), var(--font-mono)" }}>
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line)}</div>
          ))}
        </code>
      </pre>
    </div>
  )
}
