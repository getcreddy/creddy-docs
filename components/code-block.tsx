"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  lang?: string
}

export function CodeBlock({ code, lang = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState<string>("")
  const lines = code.split("\n")

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "github-dark",
    }).then(setHtml)
  }, [code, lang])

  const handleCopy = () => {
    const cleanCode = lines
      .filter((l) => !l.trimStart().startsWith("#") && !l.trimStart().startsWith("//"))
      .join("\n")
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 bg-[#161b22]">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-[#ff5f56]" />
          <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="size-2.5 rounded-full bg-[#27ca40]" />
          <span className="ml-2 text-xs text-muted-foreground font-mono">{lang}</span>
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
      <div 
        className="overflow-x-auto p-4 text-sm leading-relaxed [&_pre]:!bg-transparent [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
