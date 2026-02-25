'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, Clock, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, FileText, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'

interface DamageItem {
    id: string
    partName: string
    severity: string
    action: string
    netSubtotal: number
}

interface TrackResult {
    id: string
    status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'settled'
    vehicleModel: string
    vehicleReg: string
    createdAt: string
    totalAmount: number
    incidentType: string
    incidentDate: string
    damageItems: DamageItem[]
}

function TrackClaimContent() {
    const searchParams = useSearchParams()
    const urlId = searchParams.get('id')

    const [claimNumber, setClaimNumber] = useState(urlId || '')
    const [result, setResult] = useState<TrackResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (urlId) {
            handleSearch(urlId)
        }
    }, [urlId])

    const handleSearch = async (idToSearch: string) => {
        if (!idToSearch) return
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/api/claims/${encodeURIComponent(idToSearch)}`)
            if (!res.ok) {
                if (res.status === 404) throw new Error('Claim not found. Please check your reference number.')
                throw new Error('Failed to fetch claim data.')
            }
            const data = await res.json()
            setResult(data)
        } catch (err: any) {
            setError(err.message || 'An error occurred.')
            setResult(null)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitSearch = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch(claimNumber.trim().toUpperCase())
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'approved': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, label: 'Approved for Settlement' }
            case 'pending': return { color: 'bg-amber-100 text-amber-800 border-amber-300', icon: <Clock className="w-5 h-5 text-amber-600" />, label: 'Under Officer Review' }
            case 'rejected': return { color: 'bg-red-100 text-red-800 border-red-300', icon: <AlertCircle className="w-5 h-5 text-red-600" />, label: 'Claim Rejected' }
            case 'escalated': return { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <AlertTriangle className="w-5 h-5 text-purple-600" />, label: 'Escalated to Senior Adjuster' }
            case 'settled': return { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <Banknote className="w-5 h-5 text-blue-600" />, label: 'Payment Disbursed' }
            default: return { color: 'bg-slate-100 text-slate-800 border-slate-300', icon: <Clock className="w-5 h-5 text-slate-600" />, label: 'Unknown Status' }
        }
    }

    const buildTimeline = (claim: TrackResult) => {
        const _status = claim.status
        const timeline = [
            { done: true, label: 'Claim Filed & Intimated', time: format(new Date(claim.createdAt), 'dd MMM yyyy, p'), desc: 'Initial report received.' },
            { done: true, label: 'AI Vision Assessment', time: format(new Date(claim.createdAt), 'dd MMM yyyy, p'), desc: 'Automated damage extraction complete.' },
            { done: _status !== 'pending', active: _status === 'pending', label: 'Officer Verification', time: _status === 'pending' ? 'Currently Under Review' : 'Review Complete', desc: 'Manual cross-check of policy limits.' },
        ]

        if (_status === 'rejected') {
            timeline.push({ done: true, active: false, label: 'Claim Rejected', time: 'Resolution reached', desc: 'Claim did not meet policy criteria.' })
        } else if (_status === 'escalated') {
            timeline.push({ done: false, active: true, label: 'Escalated Investigation', time: 'Awaiting Action', desc: 'Requires physical validation or senior review.' })
        } else if (_status === 'approved' || _status === 'settled') {
            timeline.push({ done: true, active: false, label: 'Claim Approved', time: 'Success', desc: 'Amount sanctioned for release.' })
            timeline.push({ done: _status === 'settled', active: _status === 'approved', label: 'Payment Processing', time: _status === 'settled' ? 'Funds Transferred' : 'NEFT Initiated', desc: 'Transferring to provided bank account.' })
        }
        return timeline
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mb-4">
                    <Search className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Track Claim Status</h1>
                <p className="text-slate-500">Real-time tracking of your motor insurance claim</p>
            </div>

            <Card className="mb-8 border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <form onSubmit={onSubmitSearch} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="claimNumber">Claim Reference ID</Label>
                            <Input
                                id="claimNumber"
                                className="font-mono text-lg"
                                placeholder="e.g. CLM-2024-12345"
                                value={claimNumber}
                                onChange={e => setClaimNumber(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-blue-800 hover:bg-blue-900 text-white h-10 px-8"
                            disabled={loading || claimNumber.length < 5}
                        >
                            {loading ? 'Searching...' : 'Track'}
                        </Button>
                    </form>
                    {error && <p className="text-sm text-red-500 mt-3 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
                </CardContent>
            </Card>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Left Column - Details */}
                    <div className="md:col-span-7 space-y-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <div className={`px-6 py-4 border-b flex items-center justify-between ${getStatusInfo(result.status).color.replace('text-', 'bg-opacity-20 text-')}`}>
                                <div className="flex items-center gap-3">
                                    {getStatusInfo(result.status).icon}
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Current Status</div>
                                        <div className="font-bold text-lg">{getStatusInfo(result.status).label}</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`bg-white font-mono ${getStatusInfo(result.status).color.split(' ')[1]}`}>
                                    {result.id}
                                </Badge>
                            </div>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                                    <div className="p-4">
                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Vehicle</div>
                                        <div className="font-medium text-slate-900 leading-tight">{result.vehicleModel}</div>
                                        <div className="text-sm text-slate-500 mt-1">{result.vehicleReg}</div>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registration Date</div>
                                        <div className="font-medium text-slate-900">{format(new Date(result.createdAt), 'dd MMM yyyy')}</div>
                                        <div className="text-sm text-slate-500 mt-1">{format(new Date(result.createdAt), 'h:mm a')}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-100">
                                    <div className="p-4">
                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Incident Profile</div>
                                        <div className="font-medium text-slate-900">{result.incidentType}</div>
                                        <div className="text-sm text-slate-500 mt-1">{result.incidentDate}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50">
                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Sanctioned Amount</div>
                                        <div className="text-2xl font-bold text-emerald-700">₹{result.totalAmount.toLocaleString('en-IN')}</div>
                                        {result.status === 'pending' && <div className="text-xs text-amber-600 mt-1">Pending approval</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-800" /> Damage Assessment Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {result.damageItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div>
                                                <div className="font-medium text-slate-900">{item.partName}</div>
                                                <div className="text-xs text-slate-500 capitalize">{item.severity} Damage • {item.action}</div>
                                            </div>
                                            <div className="font-medium text-slate-900">₹{item.netSubtotal.toLocaleString('en-IN')}</div>
                                        </div>
                                    ))}
                                    {result.damageItems.length === 0 && (
                                        <div className="text-sm text-slate-500 text-center py-4">Assessment pending or no items found.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Timeline */}
                    <div className="md:col-span-5">
                        <Card className="border-slate-200 shadow-sm h-full">
                            <CardHeader className="pb-6 border-b border-slate-100">
                                <CardTitle className="text-lg">Progress Timeline</CardTitle>
                                <CardDescription>Trace the journey of your claim</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
                                    {buildTimeline(result).map((step, idx, arr) => (
                                        <div key={idx} className="relative pl-6">
                                            {/* Absolute Node Circle */}
                                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 
                                                ${step.done ? 'bg-emerald-500 border-white' :
                                                    step.active ? 'bg-blue-600 border-white ring-4 ring-blue-100' : 'bg-white border-slate-300'}`}
                                            />

                                            <div className="flex flex-col">
                                                <span className={`font-semibold ${step.done || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    {step.label}
                                                </span>
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">{step.time}</span>
                                                <span className="text-sm text-slate-600 mt-1.5">{step.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <div className="text-center mt-12">
                <Button variant="ghost" asChild className="text-slate-500 hover:text-slate-800">
                    <Link href="/dashboard">← Back to My Dashboard</Link>
                </Button>
            </div>
        </div>
    )
}

export default function TrackClaimPage() {
    return (
        <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading Tracking Module...</div>}>
            <TrackClaimContent />
        </Suspense>
    )
}
