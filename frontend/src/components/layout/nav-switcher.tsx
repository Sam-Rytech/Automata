'use client'
import { usePathname } from 'next/navigation'
import { NavLanding } from './nav-landing'
import { NavApp } from './nav-app'

export function NavSwitcher() {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  return isLanding ? <NavLanding /> : <NavApp />
}