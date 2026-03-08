// Utility functions for extracting headings from MDX content
// This file is for server-side use

export interface TocItem {
  id: string
  text: string
  level: number
}

// Utility function to extract headings from MDX source
export function extractHeadings(source: string): TocItem[] {
  // Strip code blocks first to avoid matching # comments
  const withoutCodeBlocks = source.replace(/```[\s\S]*?```/g, '')
  
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const level = match[1].length // 1, 2, or 3
    const text = match[2].trim()
    
    // Skip if it looks like a code comment or command
    if (text.startsWith('!') || text.includes('```') || /^[A-Z_]+\s/.test(text)) {
      continue
    }
    
    // Create a slug from the heading text
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    // Skip empty ids
    if (!id) continue

    headings.push({ id, text, level })
  }

  return headings
}
