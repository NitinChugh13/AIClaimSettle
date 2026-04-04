import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import MUIProvider from './mui-provider'
import ScrollToTop from '@/components/layout/ScrollToTop'

export const metadata: Metadata = {
  title: 'ClaimNova — Instant Motor Insurance Claims',
  description:
    'Settle your motor insurance claim in under 15 minutes with AI. No surveyor visit needed for claims up to ₹20,000. IRDA compliant.',
  keywords: 'motor insurance claim, instant settlement, AI survey, IRDA, SecureShield Insurance, PrimeCover General',
}

import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <AuthProvider>
          <MUIProvider>
            <ScrollToTop />
            {children}
            <Toaster richColors position="top-right" />
          </MUIProvider>
        </AuthProvider>
      </body>
    </html>
  )
}