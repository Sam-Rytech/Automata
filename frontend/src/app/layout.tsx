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
  other: {
    "talentapp:project_verification":"5f5af8c02bb7e41064702e5c4b5b747665490caf73efaffd2836c48d55405ab78eb321d9de07ad201b185c833e1d539e72de1208fb36a6670100d817db59be78"
      }
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
