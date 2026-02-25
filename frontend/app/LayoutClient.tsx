'use client'
import { AuthProvider } from '@/app/context/AuthContext'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
