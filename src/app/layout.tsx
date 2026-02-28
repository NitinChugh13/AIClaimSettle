import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import MUIProvider from './mui-provider'
import ScrollToTop from '@/components/layout/ScrollToTop'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
})

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
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={dmSans.className}>
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
