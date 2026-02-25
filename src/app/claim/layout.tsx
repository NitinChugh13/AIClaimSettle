import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function ClaimLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top nav bar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-800 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">ClaimSettle <span className="text-blue-700">AI</span></span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Secured & Encrypted</span>
                    </div>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
