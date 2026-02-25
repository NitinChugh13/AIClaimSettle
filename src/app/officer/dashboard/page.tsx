'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    AccessTime as ClockIcon,
    ReportProblem as AlertTriangleIcon,
    Cancel as XCircleIcon,
    TrendingUp as TrendingUpIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OfficerDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Pending Review', value: '0', icon: ClockIcon, color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
        { label: 'Approved Today', value: '0', icon: CheckCircleIcon, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
        { label: "Total Claims", value: '0', icon: TrendingUpIcon, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { label: 'Rejected', value: '0', icon: XCircleIcon, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    ]);
    const [queueClaims, setQueueClaims] = useState<any[]>([]);
    const [hourlyData, setHourlyData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/claims');
            const data = await res.json();

            // Calculate Metrics
            const pending = data.filter((c: any) => c.status === 'pending').length;
            const approved = data.filter((c: any) => c.status === 'approved').length;
            const rejected = data.filter((c: any) => c.status === 'rejected').length;
            const total = data.length;

            setStats([
                { label: 'Pending Review', value: pending.toString(), icon: ClockIcon, color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
                { label: 'Approved Today', value: approved.toString(), icon: CheckCircleIcon, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
                { label: "Total Claims", value: total.toString(), icon: TrendingUpIcon, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Rejected', value: rejected.toString(), icon: XCircleIcon, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
            ]);

            // Latest Pending
            const latest = data
                .filter((c: any) => c.status === 'pending')
                .slice(0, 3)
                .map((c: any) => ({
                    id: c.id,
                    vehicle: c.vehicleModel,
                    amount: c.totalAmount,
                    confidence: c.confidenceScore,
                    flag: c.flags?.[0] || 'New',
                    time: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })
                }));
            setQueueClaims(latest);

            // Hourly Data
            const hours: Record<string, number> = {};
            data.forEach((c: any) => {
                const hour = new Date(c.createdAt).getHours();
                const display = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
                hours[display] = (hours[display] || 0) + 1;
            });
            const formattedHourly = Object.entries(hours).map(([hour, count]) => ({ hour, claims: count }));
            setHourlyData(formattedHourly.length > 0 ? formattedHourly : [
                { hour: '9am', claims: 0 }, { hour: '12pm', claims: 0 }, { hour: '3pm', claims: 0 }, { hour: '6pm', claims: 0 }
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const channel = supabase.channel('dashboard-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>

            {/* Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Officer Dashboard</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Real-time claim processing metrics and queue monitoring.
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    href="/officer/queue"
                    variant="contained"
                    color="secondary"
                    endIcon={<ChevronRightIcon />}
                    sx={{ px: 3, py: 1.5, fontWeight: 'bold' }}
                >
                    Start Review Session
                </Button>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((s, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <Card elevation={0} sx={{ border: '1px solid', borderColor: s.border, borderRadius: 3, height: '100%' }}>
                                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                        <s.icon sx={{ color: s.color, fontSize: 28 }} />
                                    </Box>
                                    <Typography variant="h3" fontWeight="bold" gutterBottom>{s.value}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">{s.label}</Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>

                {/* Charts Section */}
                <Grid size={{ xs: 12, lg: 8 }} >
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                                <TrendingUpIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Claims Volume Distribution</Typography>
                            </Box>
                            <Box sx={{ height: 300, width: '100%' }}>
                                <ResponsiveContainer>
                                    <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="claims" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Action Queue */}
                <Grid size={{ xs: 12, lg: 4 }} >
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AlertTriangleIcon sx={{ color: '#f59e0b' }} />
                                <Typography variant="h6" fontWeight="bold">Action Required</Typography>
                            </Box>
                            <Chip label={`${queueClaims.length} Pending`} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                        </Box>

                        <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {queueClaims.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">All caught up!</Typography>
                                </Box>
                            ) : (
                                queueClaims.map((claim) => (
                                    <Box
                                        key={claim.id}
                                        component={Link}
                                        href="/officer/queue"
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid transparent',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderColor: 'divider' },
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                    {claim.id}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">{claim.vehicle}</Typography>
                                            </Box>
                                            <Chip
                                                label={claim.flag}
                                                size="small"
                                                variant="outlined"
                                                sx={{ color: '#b45309', borderColor: '#fde68a', bgcolor: '#fffbeb', fontWeight: 'bold', height: 24, fontSize: '0.7rem' }}
                                            />
                                        </Box>

                                        <Divider sx={{ mb: 1.5 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight="bold">₹{claim.amount.toLocaleString('en-IN')}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="caption" color="text.secondary">{claim.time}</Typography>
                                                <Chip
                                                    label={`Conf ${claim.confidence}%`}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.65rem',
                                                        fontWeight: 'bold',
                                                        bgcolor: claim.confidence >= 70 ? '#fef3c7' : '#fee2e2',
                                                        color: claim.confidence >= 70 ? '#b45309' : '#b91c1c'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>

                        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)', textAlign: 'center' }}>
                            <Button component={Link} href="/officer/queue" color="primary" sx={{ fontWeight: 'bold', width: '100%' }}>
                                View Complete Queue →
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
