import { Footer, Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { DocsChatSidebar } from '@/components/docs-chat'
import { DocsNavbar } from '@/components/docs-navbar'

const footer = <Footer>Apache 2.0 {new Date().getFullYear()} © Creddy</Footer>

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap('/docs')
  
  return (
    <>
      <Layout
        navbar={<DocsNavbar />}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/getcreddy/creddy-docs/tree/main"
        footer={footer}
      >
        {children}
      </Layout>
      <DocsChatSidebar />
    </>
  )
}
