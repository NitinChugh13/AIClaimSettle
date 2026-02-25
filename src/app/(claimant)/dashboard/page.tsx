'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Clock, AlertCircle, CheckCircle, Search, FileText } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface ClaimRecord {
    id: string
    policyNumber: string
    vehicleReg: string
    incidentType: string
    incidentDate: string
    totalAmount: number
    status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'settled'
    createdAt: string
}

export default function UserDashboard() {
    const [policyNumber, setPolicyNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [claims, setClaims] = useState<ClaimRecord[]>([])
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState('')

    // Try to auto-login if they just filed a claim
    useEffect(() => {
        const savedPolicy = localStorage.getItem('lastPolicyNumber')
        if (savedPolicy) {
            setPolicyNumber(savedPolicy)
            fetchHistory(savedPolicy)
        }
    }, [])

    const fetchHistory = async (policy: string) => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/api/claims/history?policy=${encodeURIComponent(policy)}`)
            if (!res.ok) throw new Error('Failed to fetch history')
            const data = await res.json()
            setClaims(data)
            setSearched(true)
            localStorage.setItem('lastPolicyNumber', policy)
        } catch (err: any) {
            setError(err.message || 'Searching failed.')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (policyNumber.length > 5) {
            fetchHistory(policyNumber.toUpperCase())
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-300'
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-300'
            case 'rejected': return 'bg-red-100 text-red-700 border-red-300'
            case 'escalated': return 'bg-purple-100 text-purple-700 border-purple-300'
            case 'settled': return 'bg-blue-100 text-blue-700 border-blue-300'
            default: return 'bg-slate-100 text-slate-700 border-slate-300'
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8 border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-8 h-8 text-blue-800" />
                    <h1 className="text-3xl font-bold text-slate-900">My Claim History</h1>
                </div>
                <p className="text-slate-500">Access your historical claims securely using your policy number.</p>
            </div>

            <Card className="mb-8 border-blue-100">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="policySearch">Insurance Policy Number</Label>
                            <Input
                                id="policySearch"
                                placeholder="e.g. POL-123456"
                                className="font-mono text-lg"
                                value={policyNumber}
                                onChange={(e) => setPolicyNumber(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading || policyNumber.length < 5}
                            className="bg-blue-800 text-white hover:bg-blue-900 h-10 px-8"
                        >
                            {loading ? 'Searching...' : 'Secure Login'}
                        </Button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </CardContent>
            </Card>

            {searched && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Found {claims.length} Claims</h2>
                        <Button variant="outline" asChild size="sm">
                            <Link href="/claim/new">File New Claim</Link>
                        </Button>
                    </div>

                    {claims.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No claims found</h3>
                            <p className="text-slate-500">There are no claims associated with {policyNumber}.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {claims.map((claim) => (
                                <Card key={claim.id} className="hover:border-blue-300 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-mono font-bold text-lg text-blue-900">{claim.id}</span>
                                                    <Badge className={getStatusColor(claim.status)} variant="outline">
                                                        {claim.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div className="text-slate-500 text-sm flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Filed: {format(new Date(claim.createdAt), 'dd MMM yyyy, p')}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                                <div>
                                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Vehicle</div>
                                                    <div className="font-medium">{claim.vehicleReg}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Incident</div>
                                                    <div className="font-medium">{claim.incidentType}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Estimate</div>
                                                    <div className="font-medium text-emerald-700">₹{claim.totalAmount.toLocaleString('en-IN')}</div>
                                                </div>
                                                <div className="flex items-center justify-end">
                                                    <Button variant="secondary" asChild className="w-full">
                                                        <Link href={`/claim/track?id=${claim.id}`}>
                                                            Live Track →
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
