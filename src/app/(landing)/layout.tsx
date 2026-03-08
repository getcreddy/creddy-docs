import { ForceDarkTheme } from '@/components/force-dark-theme'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ForceDarkTheme />
      {children}
    </>
  )
}
