'use client'

import { useState, useEffect, Suspense } from 'react'
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Grid,
    Chip,
    Avatar,
    IconButton,
    InputAdornment,
    Divider,
    CircularProgress,
    AppBar,
    Toolbar,
    useTheme,
    useMediaQuery,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Paper
} from '@mui/material'
import {
    Search as SearchIcon,
    Shield as ShieldIcon,
    CheckCircle as CheckCircleIcon,
    ErrorOutline as AlertCircleIcon,
    AccessTime as ClockIcon,
    Description as FileTextIcon,
    CurrencyRupee as IndianRupeeIcon,
    FlashOn as FlashOnIcon,
    ArrowBack as ArrowLeftIcon,
    MoreVert as MoreIcon,
    Lock as LockIcon,
    Payments as BanknoteIcon,
    Warning as AlertTriangleIcon
} from '@mui/icons-material'
import Link from 'next/link'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '@/components/Logo'

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

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

function TrackClaimContent() {
    const searchParams = useSearchParams()
    const urlId = searchParams.get('id')
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
                if (res.status === 404) throw new Error('Claim ID not found in our system.')
                throw new Error('Error connecting to settlement service.')
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
            case 'approved': return { color: '#0F9D6A', bg: 'rgba(15, 157, 106, 0.08)', icon: <CheckCircleIcon sx={{ fontSize: 24, color: '#0F9D6A' }} />, label: 'Approved' }
            case 'pending': return { color: '#E5A020', bg: 'rgba(229, 160, 32, 0.08)', icon: <FlashOnIcon sx={{ fontSize: 24, color: '#E5A020' }} />, label: 'AI Review' }
            case 'rejected': return { color: '#D64045', bg: 'rgba(214, 64, 69, 0.08)', icon: <AlertCircleIcon sx={{ fontSize: 24, color: '#D64045' }} />, label: 'Rejected' }
            case 'escalated': return { color: '#6B5FD6', bg: 'rgba(107, 95, 214, 0.08)', icon: <AlertTriangleIcon sx={{ fontSize: 24, color: '#6B5FD6' }} />, label: 'Officer Review' }
            case 'settled': return { color: '#2D5F9E', bg: 'rgba(45, 95, 158, 0.08)', icon: <BanknoteIcon sx={{ fontSize: 24, color: '#2D5F9E' }} />, label: 'Settled' }
            default: return { color: '#8DA5BE', bg: 'rgba(138, 165, 190, 0.08)', icon: <ClockIcon sx={{ fontSize: 24, color: '#8DA5BE' }} />, label: 'Processing' }
        }
    }

    const buildTimeline = (claim: TrackResult) => {
        const _status = claim.status
        const timeline = [
            { done: true, label: 'Claim Received', time: format(new Date(claim.createdAt), 'dd MMM, HH:mm'), desc: 'Initial report ingested and registered.' },
            { done: true, label: 'AI Photo Analysis', time: format(new Date(claim.createdAt), 'dd MMM, HH:mm'), desc: 'AI successfully extracted damage vectors from submitted photos.' },
            { done: _status !== 'pending', active: _status === 'pending', label: 'Compliance Check', time: _status === 'pending' ? 'Verification Ongoing' : 'Verified', desc: 'Policy limits and KYC cross-check completed.' },
        ]

        if (_status === 'rejected') {
            timeline.push({ done: true, active: false, label: 'Claim Rejected', time: 'Terminated', desc: 'Claim does not meet eligibility criteria.' })
        } else if (_status === 'escalated') {
            timeline.push({ done: false, active: true, label: 'Officer Review', time: 'Awaiting Action', desc: 'Assigned to a physical damage assessor.' })
        } else if (_status === 'approved' || _status === 'settled') {
            timeline.push({ done: true, active: false, label: 'Final Approval', time: 'Success', desc: 'Funds sanctioned for electronic release.' })
            timeline.push({ done: _status === 'settled', active: _status === 'approved', label: 'Payment Processing', time: _status === 'settled' ? 'Settled' : 'In Progress', desc: 'Transaction broadcast to bank.' })
        }
        return timeline
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F0F6FF' }} className="page-gradient-static">
            {/* Header */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #CBD8EA' }}>
                <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Logo variant="dark" />
                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 0.5, borderRadius: '20px', bgcolor: 'rgba(15, 157, 106, 0.08)', color: '#0F9D6A', border: '1px solid rgba(15, 157, 106, 0.25)' }}>
                        <LockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight="bold">SECURED & ENCRYPTED</Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Box sx={{ maxWidth: result ? '1100px' : '600px', mx: 'auto' }}>
                    {/* Search Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: result ? '48px' : '0' }}
                    >
                        {!result && (
                            <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Box sx={{
                                    width: 64, height: 64, borderRadius: '16px', mx: 'auto', mb: 3,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: 'rgba(45, 95, 158, 0.08)', border: '1px solid rgba(45, 95, 158, 0.2)'
                                }}>
                                    <SearchIcon sx={{ fontSize: 32, color: '#2D5F9E' }} />
                                </Box>
                                <Typography variant="h3" fontWeight="800" gutterBottom sx={{ color: '#1A2B3C' }}>
                                    Track Your Claim
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4A6080', mb: 5, maxWidth: 460, mx: 'auto' }}>
                                    Enter your Claim ID to get real-time status updates and settlement progress.
                                </Typography>

                                <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 8px 32px rgba(30, 58, 95, 0.1)' }}>
                                    <form onSubmit={onSubmitSearch}>
                                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter Claim ID (e.g. CLM-XXXXX)"
                                                value={claimNumber}
                                                onChange={(e) => setClaimNumber(e.target.value.toUpperCase())}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon sx={{ color: '#8DA5BE' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#FAFCFF' } }}
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={loading || claimNumber.length < 5}
                                                sx={{
                                                    px: 4, py: 1.5, borderRadius: '12px', fontWeight: 700,
                                                    background: 'linear-gradient(135deg, #1E3A5F, #2D5F9E)',
                                                    minWidth: '160px'
                                                }}
                                            >
                                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Track Claim'}
                                            </Button>
                                        </Box>
                                        {error && (
                                            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                                <AlertCircleIcon sx={{ fontSize: 16 }} /> {error}
                                            </Typography>
                                        )}
                                    </form>
                                </Paper>

                                <Button
                                    component={Link}
                                    href="/dashboard"
                                    startIcon={<ArrowLeftIcon />}
                                    sx={{ mt: 4, color: '#4A6080', fontWeight: 600 }}
                                >
                                    Return to Dashboard
                                </Button>
                            </Box>
                        )}
                    </motion.div>

                    {/* Result Content */}
                    {result && (
                        <Grid container spacing={4}>
                            {/* Left Column */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <motion.div variants={itemVariants} initial="hidden" animate="show">
                                    <Card sx={{ borderRadius: '24px', boxShadow: '0 8px 32px rgba(30, 58, 95, 0.08)', overflow: 'hidden' }}>
                                        <Box sx={{ p: 4, borderBottom: '1px solid #CBD8EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                                <Box sx={{
                                                    width: 56, height: 56, borderRadius: '16px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    bgcolor: getStatusInfo(result.status).bg
                                                }}>
                                                    {getStatusInfo(result.status).icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                                        Current Status
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight="900" sx={{ color: getStatusInfo(result.status).color }}>
                                                        {getStatusInfo(result.status).label}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip label={`ID: ${result.id.slice(0, 12).toUpperCase()}`} sx={{ bgcolor: '#F0F6FF', color: '#4A6080', fontWeight: 700, borderRadius: '8px' }} />
                                        </Box>

                                        <Grid container sx={{ borderBottom: '1px solid #CBD8EA' }}>
                                            <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 4, borderRight: { sm: '1px solid #CBD8EA' }, borderBottom: { xs: '1px solid #CBD8EA', sm: 'none' } }}>
                                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, textTransform: 'uppercase' }}>Vehicle</Typography>
                                                <Typography variant="h6" fontWeight="800" sx={{ color: '#1A2B3C', mt: 1 }}>{result.vehicleModel}</Typography>
                                                <Typography variant="body2" sx={{ color: '#2D5F9E', fontWeight: 700, letterSpacing: 1 }}>{result.vehicleReg}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 4 }}>
                                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, textTransform: 'uppercase' }}>Claim Date</Typography>
                                                <Typography variant="h6" fontWeight="800" sx={{ color: '#1A2B3C', mt: 1 }}>{format(new Date(result.createdAt), 'dd MMMM yyyy')}</Typography>
                                                <Typography variant="body2" sx={{ color: '#4A6080' }}>Filed at {format(new Date(result.createdAt), 'HH:mm')}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container>
                                            <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 4, borderRight: { sm: '1px solid #CBD8EA' }, borderBottom: { xs: '1px solid #CBD8EA', sm: 'none' } }}>
                                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, textTransform: 'uppercase' }}>Incident Type</Typography>
                                                <Typography variant="h6" fontWeight="800" sx={{ color: '#1A2B3C', mt: 1, textTransform: 'capitalize' }}>{result.incidentType}</Typography>
                                                <Typography variant="body2" sx={{ color: '#4A6080' }}>{result.incidentDate}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 4, bgcolor: 'rgba(45, 95, 158, 0.02)' }}>
                                                <Typography variant="caption" sx={{ color: '#2D5F9E', fontWeight: 700, textTransform: 'uppercase' }}>Assessed Amount</Typography>
                                                <Typography variant="h4" fontWeight="900" sx={{ color: '#1E3A5F', mt: 0.5 }}>₹{result.totalAmount.toLocaleString('en-IN')}</Typography>
                                                {result.status === 'pending' && (
                                                    <Chip
                                                        icon={<FlashOnIcon sx={{ fontSize: '14px !important' }} className="pulse-icon" />}
                                                        label="Valuation in progress"
                                                        size="small"
                                                        sx={{ mt: 1.5, bgcolor: 'rgba(229, 160, 32, 0.1)', color: '#E5A020', border: '1px solid rgba(229, 160, 32, 0.2)', fontWeight: 700 }}
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Card>

                                    {/* Damage Items */}
                                    <Card sx={{ mt: 4, borderRadius: '24px', boxShadow: '0 4px 16px rgba(30, 58, 95, 0.06)' }}>
                                        <Box sx={{ p: 3, px: 4, borderBottom: '1px solid #CBD8EA', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', borderRadius: '12px' }}>
                                                <ShieldIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="800">Damage Assessment</Typography>
                                                <Typography variant="caption" sx={{ color: '#8DA5BE' }}>AI-identified damage items</Typography>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ p: 0 }}>
                                            {result.damageItems.length === 0 ? (
                                                <Box sx={{ p: 8, textAlign: 'center', opacity: 0.5 }}>
                                                    <SearchIcon sx={{ fontSize: 48, color: '#CBD8EA', mb: 2 }} />
                                                    <Typography variant="body2">Awaiting AI analysis results...</Typography>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    {result.damageItems.map((item, idx) => (
                                                        <Box
                                                            key={item.id}
                                                            sx={{
                                                                p: 2.5, px: 4,
                                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                bgcolor: idx % 2 === 0 ? '#FAFCFF' : 'white',
                                                                borderBottom: idx < result.damageItems.length - 1 ? '1px solid #F0F6FF' : 'none'
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <FlashOnIcon sx={{ color: '#8DA5BE', fontSize: 20 }} />
                                                                <Box>
                                                                    <Typography variant="body1" fontWeight="700">{item.partName}</Typography>
                                                                    <Typography variant="caption" sx={{ color: '#8DA5BE', textTransform: 'uppercase', fontWeight: 600 }}>
                                                                        {item.severity} · {item.action}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Typography variant="h6" fontWeight="800" sx={{ color: '#2D5F9E' }}>
                                                                ₹{item.netSubtotal.toLocaleString('en-IN')}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Right Column - Timeline */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <motion.div variants={itemVariants} initial="hidden" animate="show">
                                    <Card sx={{ borderRadius: '24px', boxShadow: '0 8px 32px rgba(30, 58, 95, 0.08)', position: 'relative' }}>
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #1E3A5F, #2D5F9E, #67E8F9)' }} />
                                        <Box sx={{ p: 4, pt: 5, borderBottom: '1px solid #CBD8EA' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <ClockIcon sx={{ color: '#2D5F9E' }} />
                                                <Typography variant="h6" fontWeight="900" sx={{ color: '#1A2B3C' }}>Claim Timeline</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#8DA5BE' }}>Processing history & logs</Typography>
                                        </Box>
                                        <CardContent sx={{ p: 4, pt: 5 }}>
                                            <Stepper orientation="vertical" connector={<Box sx={{ ml: 1.5, minHeight: 40, borderLeft: '2px solid #CBD8EA' }} />}>
                                                {buildTimeline(result).map((step, index) => (
                                                    <Step key={index} active={true} expanded={true}>
                                                        <StepLabel
                                                            icon={
                                                                <Box sx={{
                                                                    width: 14, height: 14, borderRadius: '50%',
                                                                    bgcolor: step.done ? '#0F9D6A' : step.active ? '#2D5F9E' : '#CBD8EA',
                                                                    boxShadow: step.active ? '0 0 0 4px rgba(45, 95, 158, 0.15)' : 'none'
                                                                }} />
                                                            }
                                                        >
                                                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: step.done || step.active ? '#1A2B3C' : '#8DA5BE' }}>
                                                                {step.label}
                                                            </Typography>
                                                            <Typography variant="caption" fontWeight="bold" sx={{ color: step.done ? '#0F9D6A' : step.active ? '#2D5F9E' : '#8DA5BE' }}>
                                                                {step.time}
                                                            </Typography>
                                                        </StepLabel>
                                                        <StepContent>
                                                            <Typography variant="body2" sx={{ color: '#4A6080', mb: 2 }}>
                                                                {step.desc}
                                                            </Typography>
                                                        </StepContent>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </CardContent>
                                    </Card>

                                    <Button
                                        component={Link}
                                        href="/dashboard"
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<ArrowLeftIcon />}
                                        sx={{ mt: 3, py: 1.5, borderRadius: '12px', fontWeight: 700, color: '#4A6080', borderColor: '#CBD8EA' }}
                                    >
                                        Back to Dashboard
                                    </Button>
                                </motion.div>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Container>

            <style jsx global>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                    100% { transform: scale(0.9); opacity: 0.8; }
                }
                .pulse-icon {
                    animation: pulse-ring 2s ease infinite;
                }
            `}</style>
        </Box>
    )
}

export default function TrackClaimPage() {
    return (
        <Suspense fallback={
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#F0F6FF' }}>
                <CircularProgress size={40} sx={{ color: '#2D5F9E', mb: 2 }} />
                <Typography variant="caption" fontWeight="bold" sx={{ color: '#8DA5BE', letterSpacing: 1.5 }}>LOADING NOVA UPLINK...</Typography>
            </Box>
        }>
            <TrackClaimContent />
        </Suspense>
    )
}
