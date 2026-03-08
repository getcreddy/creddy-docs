import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  code: string
  language?: string
}

export async function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  })

  return (
    <div 
      style={{ 
        marginBottom: '1.25rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  )
}
