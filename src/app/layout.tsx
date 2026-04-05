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
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%233B82F6'/><path d='M58 12L28 54H50L42 88L72 46H50L58 12Z' fill='white' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  },
}

import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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