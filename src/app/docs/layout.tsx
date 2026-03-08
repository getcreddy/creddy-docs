import { Footer, Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { DocsChatSidebar } from '@/components/docs-chat'
import { DocsNavbar } from '@/components/docs-navbar'

const footer = <Footer key="footer">Apache 2.0 {new Date().getFullYear()} © Creddy</Footer>

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap('/docs')
  
  return (
    <div key="docs-layout-wrapper">
      <Layout
        key="docs-layout"
        navbar={<DocsNavbar key="docs-navbar" />}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/getcreddy/creddy-docs/tree/main"
        footer={footer}
      >
        {children}
      </Layout>
      <DocsChatSidebar key="docs-chat" />
    </div>
  )
}
