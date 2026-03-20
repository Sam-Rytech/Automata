import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import { NavSwitcher } from '@/components/layout/nav-switcher'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne-var',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Automata — Cross-Chain Automation',
  description: 'Visual cross-chain flows. One click execution. Built by Velocity Labs.',

   icons: {
    icon: "/Automata_Icon.png",
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={syne.variable}>
      <body>
         <NavSwitcher />
        {children}
      </body>
    </html>
  )
}