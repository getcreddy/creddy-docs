'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc-utils'

interface TableOfContentsProps {
  headings: TocItem[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">On this page</p>
        <ul className="space-y-1 text-sm border-l border-border">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: heading.level === 1 ? '0.75rem' : heading.level === 2 ? '1rem' : '1.5rem' }}
              className="-ml-px"
            >
              <a
                href={`#${heading.id}`}
                className={`block py-1 transition-colors border-l-2 -ml-px pl-3 ${
                  activeId === heading.id
                    ? 'text-foreground border-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                    setActiveId(heading.id)
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
