import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import '../styles/globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: 'Creddy — OIDC Identity for AI Agents',
  description: 'Open source OIDC provider for AI agents. Agents get their own identities and short-lived credentials — your secrets stay on the server.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1628' },
  ],
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
