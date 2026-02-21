import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700 }}>Creddy</span>,
  project: {
    link: 'https://github.com/getcreddy/creddy',
  },
  docsRepositoryBase: 'https://github.com/getcreddy/creddy-docs/tree/main',
  footer: {
    text: 'Creddy - Ephemeral credentials for AI agents',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Creddy'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Creddy - Ephemeral credentials for AI agents" />
    </>
  ),
  primaryHue: 200,
}

export default config
