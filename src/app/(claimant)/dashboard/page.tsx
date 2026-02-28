'use client'

import { useState, useEffect } from 'react'
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
    useMediaQuery
} from '@mui/material'
import {
    Shield as ShieldIcon,
    AccessTime as ClockIcon,
    ErrorOutline as AlertCircleIcon,
    CheckCircle as CheckCircleIcon,
    Search as SearchIcon,
    Description as FileTextIcon,
    FlashOn as FlashOnIcon,
    CurrencyRupee as IndianRupeeIcon,
    TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowRightIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material'
import Link from 'next/link'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Car } from 'lucide-react'
import Logo from '@/components/Logo'
import { useAuth } from '@/context/AuthContext'

interface ClaimRecord {
    id: string
    claim_number: string
    policyNumber: string
    vehicleReg: string
    incidentType: string
    incidentDate: string
    estimated_repair_cost: number
    ai_approved_amount: number
    final_approved_amount: number
    totalAmount: number
    status: string
    createdAt: string
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function UserDashboard() {
    const [policyNumber, setPolicyNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [policy, setPolicy] = useState<any>(null)
    const [claims, setClaims] = useState<ClaimRecord[]>([])
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState('')
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const { user, logout, loading: authLoading } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch user's linked policy and history on mount
    useEffect(() => {
        if (mounted && user) {
            fetchMyPolicy()
        }
    }, [mounted, user])

    const fetchMyPolicy = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/policies/my-policy')
            if (res.ok) {
                const data = await res.json()
                setPolicy(data.policy)
                setSearched(true)
                // Automatically fetch history for this policy
                fetchHistory(data.policy.policy_number)
            } else {
                // If no policy found, middleware should have caught this, 
                // but we handle it just in case.
                setSearched(false)
            }
        } catch (err) {
            console.error('Error fetching policy:', err)
            setError('Failed to load policy details')
        } finally {
            setLoading(false)
        }
    }

    const fetchHistory = async (policyNum: string) => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/api/claims/history?policy=${encodeURIComponent(policyNum)}`)
            if (!res.ok) throw new Error('Failed to fetch history')
            const data = await res.json()
            console.log('[Claim History Raw]:', data);
            setClaims(data)
        } catch (err: any) {
            console.error('Search failed:', err)
            // It's okay if history is empty for a new user
            setClaims([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }

    const getStatusProps = (status: string) => {
        const lowerStatus = status?.toLowerCase();
        switch (lowerStatus) {
            case 'approved':
            case 'ai_complete':
            case 'ai_reviewed':
                return { color: '#0F9D6A', label: 'Approved', icon: <CheckCircleIcon /> }
            case 'pending':
            case 'submitted':
            case 'ai_processing':
                return { color: '#E5A020', label: 'Pending', icon: <ClockIcon /> }
            case 'rejected': return { color: '#D64045', label: 'Rejected', icon: <AlertCircleIcon /> }
            case 'escalated': return { color: '#6B5FD6', label: 'Escalated', icon: <AlertCircleIcon /> }
            case 'settled': return { color: '#2D5F9E', label: 'Settled', icon: <CheckCircleIcon /> }
            default: return { color: '#8DA5BE', label: status?.replace('_', ' ').toUpperCase(), icon: <FileTextIcon /> }
        }
    }

    // Settled calculation: SUM of final_approved_amount for 'approved' status
    const totalSettled = claims
        .filter(c => c.status === 'approved' || c.status === 'settled')
        .reduce((acc, curr) => acc + (curr.final_approved_amount || curr.ai_approved_amount || 0), 0)

    const pendingClaims = claims.filter(c => ['submitted', 'ai_processing', 'pending'].includes(c.status)).length

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F0F6FF' }} className="page-gradient-static">
            {/* Header */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #CBD8EA' }}>
                <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Logo variant="dark" />
                    </Link>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {mounted && !authLoading && (
                            <>
                                {user && (
                                    <Box sx={{ fontWeight: 600, color: '#4A6080', display: { xs: 'none', sm: 'block' } }}>
                                        👋 {user.full_name}
                                    </Box>
                                )}
                                <Link href="/claim/track" passHref style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="text"
                                        sx={{ color: '#4A6080', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
                                    >
                                        Track View
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => logout()}
                                    sx={{ color: '#D64045', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                        <Button
                            component={Link}
                            href="/claim/new"
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #1E3A5F, #2D5F9E)',
                                fontWeight: 700,
                                px: 3,
                                borderRadius: '10px'
                            }}
                        >
                            ⚡ Nova Strike
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                {!searched ? (
                    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: '100%', maxWidth: '500px' }}
                        >
                            <Card sx={{
                                borderRadius: '24px',
                                boxShadow: '0 12px 40px rgba(30, 58, 95, 0.12)',
                                p: { xs: 3, md: 5 },
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '6px',
                                    background: 'linear-gradient(90deg, #1E3A5F, #3B82C4)'
                                }} />

                                <Avatar sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'rgba(45, 95, 158, 0.1)',
                                    color: '#2D5F9E',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    <FlashOnIcon sx={{ fontSize: 40 }} />
                                </Avatar>

                                <Typography variant="h5" fontWeight="800" sx={{ color: '#1A2B3C', mb: 1 }}>
                                    Secure Access
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4A6080', mb: 4 }}>
                                    Enter your policy number to retrieve your claim history.
                                </Typography>

                                <form onSubmit={handleSearch}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Policy Number"
                                            placeholder="POL-XXXXXX"
                                            variant="outlined"
                                            value={policyNumber}
                                            onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <ShieldIcon sx={{ color: '#8DA5BE' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={loading || policyNumber.length < 5}
                                            sx={{
                                                py: 2,
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #1E3A5F, #2D5F9E)',
                                                '&:hover': { background: '#1E3A5F' }
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enter Dashboard'}
                                        </Button>
                                    </Box>
                                </form>
                                {error && (
                                    <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
                                        {error}
                                    </Typography>
                                )}
                            </Card>
                        </motion.div>
                    </Box>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Header Section */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="900" sx={{ color: '#1A2B3C', mb: 0.5 }}>
                                    Claim Dashboard
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4A6080' }}>
                                    Welcome back, <span style={{ fontWeight: 700, color: '#2D5F9E' }}>{user?.full_name}</span>
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                component={Link}
                                href="/claim/new"
                                startIcon={<FlashOnIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                }}
                            >
                                File New Claim
                            </Button>
                        </Box>

                        {/* Policy Details Card */}
                        {policy && (
                            <Card sx={{
                                borderRadius: '24px',
                                border: '1px solid #CBD8EA',
                                mb: 5,
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(30, 58, 95, 0.05)'
                            }}>
                                <Box sx={{
                                    background: 'linear-gradient(90deg, #1E3A5F, #2D5F9E)',
                                    px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                                        <ShieldIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="subtitle2" fontWeight="700">ACTIVE POLICY: {policy.policy_number}</Typography>
                                    </Box>
                                    <Chip
                                        label={policy.policy_type}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
                                    />
                                </Box>
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: '#F0F6FF', color: '#2D5F9E', borderRadius: '12px' }}>
                                                    <Car size={24} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" fontWeight="700">VEHICLE DETAILS</Typography>
                                                    <Typography variant="body1" fontWeight="800" color="#1A2B3C">
                                                        {policy.vehicle_make} {policy.vehicle_model}
                                                    </Typography>
                                                    <Typography variant="body2" color="#4A6080" fontWeight="600">
                                                        {policy.vehicle_number} • {policy.vehicle_year}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6, md: 2.5 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="700">INSURER</Typography>
                                            <Typography variant="body1" fontWeight="700" color="#1A2B3C">{policy.insurer_name}</Typography>
                                            <Typography variant="caption" color="#0F9D6A" fontWeight="700">VALID TILL: {format(new Date(policy.policy_end_date), 'dd MMM yyyy')}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, md: 2 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="700">IDV VALUE</Typography>
                                            <Typography variant="h6" fontWeight="900" color="#2D5F9E">₹{Number(policy.idv_value).toLocaleString('en-IN')}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 3.5 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ mb: 1, display: 'block' }}>COVERAGE & ADD-ONS</Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {policy.own_damage_cover && <Chip label="OD" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />}
                                                {policy.third_party_cover && <Chip label="TP" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />}
                                                {policy.personal_accident_cover && <Chip label="PA" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700 }} />}
                                                {policy.zero_depreciation && <Chip label="Zero Dep" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700 }} />}
                                                {policy.roadside_assistance && <Chip label="RSA" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#F3E5F5', color: '#7B1FA2', fontWeight: 700 }} />}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Stats Row */}
                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            {[
                                { label: 'Total Claims', value: claims.length, icon: <FileTextIcon />, color: '#2D5F9E' },
                                { label: 'Settled Amount', value: `₹${totalSettled.toLocaleString('en-IN')}`, icon: <IndianRupeeIcon />, color: '#0F9D6A' },
                                { label: 'Active Tasks', value: pendingClaims, icon: <TrendingUpIcon />, color: '#E5A020' },
                            ].map((stat, i) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={i}>
                                    <Card sx={{
                                        borderRadius: '20px',
                                        p: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2.5,
                                        border: '1px solid #CBD8EA',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)' }
                                    }}>
                                        <Box sx={{
                                            width: 56, height: 56, borderRadius: '15px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: `${stat.color}11`, color: stat.color
                                        }}>
                                            {stat.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="h6" fontWeight="900" sx={{ color: '#1A2B3C' }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Claims List Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ color: '#1A2B3C' }}>
                                Your Claims History
                            </Typography>
                            <Chip
                                label={`${claims.length} Records`}
                                size="small"
                                sx={{ bgcolor: 'rgba(45, 95, 158, 0.08)', color: '#2D5F9E', fontWeight: 700 }}
                            />
                        </Box>

                        {/* List Area */}
                        {claims.length === 0 ? (
                            <Card sx={{
                                py: 10, textAlign: 'center', borderRadius: '24px',
                                border: '2px dashed #CBD8EA', bgcolor: 'transparent', boxShadow: 'none'
                            }}>
                                <FileTextIcon sx={{ fontSize: 60, color: '#CBD8EA', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A6080' }}>
                                    No processing history found
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#8DA5BE' }}>
                                    Any claims filed with this policy will appear here.
                                </Typography>
                            </Card>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <AnimatePresence>
                                    {claims.map((claim) => {
                                        const status = getStatusProps(claim.status)
                                        return (
                                            <motion.div
                                                key={claim.id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="show"
                                            >
                                                <Card sx={{
                                                    borderRadius: '16px',
                                                    border: '1px solid #CBD8EA',
                                                    p: { xs: 2.5, md: 3 },
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: '#2D5F9E',
                                                        boxShadow: '0 8px 24px rgba(30, 58, 95, 0.08)'
                                                    }
                                                }}>
                                                    <Grid container alignItems="center" spacing={2}>
                                                        <Grid size={{ xs: 12, sm: 2 }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                <Typography variant="caption" sx={{ color: '#2D5F9E', fontWeight: 900, fontFamily: 'monospace' }}>
                                                                    {claim.claim_number || `#{claim.id.split('-')[0].toUpperCase()}`}
                                                                </Typography>
                                                                <Chip
                                                                    icon={status.icon}
                                                                    label={status.label}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: `${status.color}11`,
                                                                        color: status.color,
                                                                        fontWeight: 800,
                                                                        fontSize: '10px',
                                                                        height: 22,
                                                                        width: 'fit-content'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 4, sm: 1.5 }}>
                                                            <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block', fontWeight: 700 }}>Type</Typography>
                                                            <Typography variant="body2" fontWeight="700" sx={{ color: '#1A2B3C' }}>{claim.incidentType}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 4, sm: 1.5 }}>
                                                            <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block', fontWeight: 700 }}>Date</Typography>
                                                            <Typography variant="body2" fontWeight="700" sx={{ color: '#1A2B3C' }}>{claim.incidentDate}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 4, sm: 1.5 }}>
                                                            <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block', fontWeight: 700 }}>Claimed</Typography>
                                                            <Typography variant="body2" fontWeight="700" sx={{ color: '#1A2B3C' }}>₹{claim.estimated_repair_cost?.toLocaleString('en-IN')}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 4, sm: 1.5 }}>
                                                            <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block', fontWeight: 700 }}>AI Audit</Typography>
                                                            <Typography variant="body2" fontWeight="700" sx={{ color: '#2D5F9E' }}>₹{claim.ai_approved_amount?.toLocaleString('en-IN')}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 4, sm: 2 }}>
                                                            <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block', fontWeight: 700 }}>Final Approved</Typography>
                                                            <Typography variant="body1" fontWeight="900" sx={{ color: '#0F9D6A' }}>₹{(claim.final_approved_amount || claim.ai_approved_amount || 0).toLocaleString('en-IN')}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                            <Button
                                                                component={Link}
                                                                href={`/claim/track?id=${claim.claim_number || claim.id}`}
                                                                variant="outlined"
                                                                size="small"
                                                                endIcon={<ArrowRightIcon />}
                                                                sx={{
                                                                    borderRadius: '10px',
                                                                    fontWeight: 700,
                                                                    textTransform: 'none',
                                                                    px: 2,
                                                                    bgcolor: 'rgba(45, 95, 158, 0.04)',
                                                                    '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.08)' }
                                                                }}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </Box>
                        )}

                        <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.6 }}>
                            <Typography variant="caption" sx={{ letterSpacing: 1.5, fontWeight: 700, color: '#4A6080' }}>
                                SECURE NOVA INTELLIGENCE UPLINK ACTIVE
                            </Typography>
                        </Box>
                    </motion.div>
                )}
            </Container>
        </Box>
    )
}
