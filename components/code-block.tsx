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
    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-white/50 font-mono">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
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
        className="overflow-x-auto p-4 text-sm leading-relaxed [&_pre]:!bg-black [&_pre]:!m-0 [&_code]:!bg-black"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
