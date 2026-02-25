import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import MUIProvider from './mui-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClaimSettle AI — Instant Motor Insurance Claims',
  description:
    'Settle your motor insurance claim in under 15 minutes with AI. No surveyor visit needed for claims up to ₹20,000. IRDAI compliant.',
  keywords: 'motor insurance claim, instant settlement, AI survey, IRDAI, UIIC, Oriental Insurance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MUIProvider>
          {children}
          <Toaster richColors position="top-right" />
        </MUIProvider>
      </body>
    </html>
  )
}
