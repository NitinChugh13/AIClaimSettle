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
import Logo from '@/components/Logo'
import { useAuth } from '@/context/AuthContext'

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function UserDashboard() {
    const [policyNumber, setPolicyNumber] = useState('')
    const [loading, setLoading] = useState(false)
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

    const getStatusProps = (status: string) => {
        switch (status) {
            case 'approved': return { color: '#0F9D6A', label: 'Approved', icon: <CheckCircleIcon /> }
            case 'pending': return { color: '#E5A020', label: 'Pending', icon: <ClockIcon /> }
            case 'rejected': return { color: '#D64045', label: 'Rejected', icon: <AlertCircleIcon /> }
            case 'escalated': return { color: '#6B5FD6', label: 'Escalated', icon: <AlertCircleIcon /> }
            case 'settled': return { color: '#2D5F9E', label: 'Settled', icon: <CheckCircleIcon /> }
            default: return { color: '#8DA5BE', label: status, icon: <FileTextIcon /> }
        }
    }

    const totalSettled = claims.filter(c => c.status === 'settled').reduce((acc, curr) => acc + curr.totalAmount, 0)
    const pendingClaims = claims.filter(c => c.status === 'pending').length

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
                                <Button
                                    component={Link}
                                    href="/claim/track"
                                    variant="text"
                                    sx={{ color: '#4A6080', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
                                >
                                    Track View
                                </Button>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="900" sx={{ color: '#1A2B3C', mb: 0.5 }}>
                                    Claim Dashboard
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4A6080' }}>
                                    Managing policy: <span style={{ fontWeight: 700, color: '#2D5F9E' }}>{policyNumber}</span>
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => { setSearched(false); setPolicyNumber(''); localStorage.removeItem('lastPolicyNumber'); }}
                                startIcon={<LogoutIcon />}
                                sx={{ borderRadius: '8px' }}
                            >
                                Switch Policy
                            </Button>
                        </Box>

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
                                                    <Grid container alignItems="center" spacing={3}>
                                                        <Grid size={{ xs: 12, sm: 3 }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                <Typography variant="caption" sx={{ color: '#8DA5BE', fontWeight: 700 }}>
                                                                    ID: #{claim.id.split('-')[0].toUpperCase()}
                                                                </Typography>
                                                                <Chip
                                                                    icon={status.icon}
                                                                    label={status.label}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: `${status.color}11`,
                                                                        color: status.color,
                                                                        borderColor: `${status.color}33`,
                                                                        border: '1px solid',
                                                                        fontWeight: 700,
                                                                        px: 1,
                                                                        width: 'fit-content'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 6, sm: 2.5 }}>
                                                            <Box>
                                                                <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block' }}>Vehicle</Typography>
                                                                <Typography variant="body2" fontWeight="700" sx={{ color: '#1A2B3C' }}>{claim.vehicleReg}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 6, sm: 2.5 }}>
                                                            <Box>
                                                                <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block' }}>Incident</Typography>
                                                                <Typography variant="body2" fontWeight="700" sx={{ color: '#1A2B3C' }}>{claim.incidentType}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 6, sm: 2 }}>
                                                            <Box>
                                                                <Typography variant="caption" sx={{ color: '#8DA5BE', display: 'block' }}>Amount</Typography>
                                                                <Typography variant="body1" fontWeight="900" sx={{ color: '#0F9D6A' }}>₹{claim.totalAmount.toLocaleString('en-IN')}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                                            <Button
                                                                component={Link}
                                                                href={`/claim/track?id=${claim.id}`}
                                                                variant="outlined"
                                                                size="medium"
                                                                endIcon={<ArrowRightIcon />}
                                                                sx={{
                                                                    borderRadius: '12px',
                                                                    px: 3,
                                                                    bgcolor: 'rgba(45, 95, 158, 0.04)',
                                                                    '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.08)' }
                                                                }}
                                                            >
                                                                Track
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
