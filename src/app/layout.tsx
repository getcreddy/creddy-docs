import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import { DocsChat } from '@/components/docs-chat'
import '../styles/globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: 'Creddy — Credential Management for AI Agents',
  description: 'Open source, self-hosted identity service that issues ephemeral, scoped credentials to AI agents. Stop sharing your keys.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b1628',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <Script
          defer
          data-domain="creddy.dev"
          src="https://plausible.machination.dev/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`font-sans antialiased ${geist.variable} ${geistMono.variable} ${jetbrainsMono.variable}`}>
        {children}
        <DocsChat />
      </body>
    </html>
  )
}
