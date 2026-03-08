// Utility functions for extracting headings from MDX content
// This file is for server-side use

export interface TocItem {
  id: string
  text: string
  level: number
}

// Utility function to extract headings from MDX source
export function extractHeadings(source: string): TocItem[] {
  const headingRegex = /^#{2,3}\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[0].startsWith('###') ? 3 : 2
    const text = match[1].trim()
    // Create a slug from the heading text
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    headings.push({ id, text, level })
  }

  return headings
}
