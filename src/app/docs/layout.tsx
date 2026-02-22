import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { ChatProvider, ChatPanel, AskAIButton } from '@/components/docs-chat'

const footer = <Footer>Apache 2.0 {new Date().getFullYear()} © Creddy</Footer>

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap('/docs')
  
  const navbar = (
    <Navbar
      logo={<b>Creddy</b>}
      projectLink="https://github.com/getcreddy/creddy"
    >
      <AskAIButton />
    </Navbar>
  )
  
  return (
    <ChatProvider>
      <Layout
        navbar={navbar}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/getcreddy/creddy-docs/tree/main"
        footer={footer}
      >
        {children}
      </Layout>
      <ChatPanel />
    </ChatProvider>
  )
}
