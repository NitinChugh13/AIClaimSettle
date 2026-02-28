'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Button,
    Avatar,
    Stack,
    CircularProgress,
    Switch,
    Tooltip
} from '@mui/material';
import {
    BarChart as BarChartIcon,
    People as PeopleIcon,
    Assignment as ClaimsIcon,
    Engineering as SurveyorIcon,
    TrendingUp as TrendingUpIcon,
    CurrencyRupee as RupeeIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Visibility as ViewIcon,
    ToggleOn as ToggleOnIcon,
    ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminDashboard() {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [claims, setClaims] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [surveyors, setSurveyors] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, claimsRes, usersRes, surveyorsRes] = await Promise.all([
                fetch('/api/admin/stats', { credentials: 'include' }),
                fetch('/api/admin/claims', { credentials: 'include' }),
                fetch('/api/admin/users', { credentials: 'include' }),
                fetch('/api/admin/surveyors', { credentials: 'include' })
            ]);

            const statsDoc = await statsRes.json();
            const claimsDoc = await claimsRes.json();
            const usersDoc = await usersRes.json();
            const surveyorsDoc = await surveyorsRes.json();

            if (statsDoc.success) setStats(statsDoc.stats);
            if (Array.isArray(claimsDoc)) setClaims(claimsDoc);
            else if (claimsDoc.success) setClaims(claimsDoc.claims);
            if (usersDoc.success) setUsers(usersDoc.users);
            if (surveyorsDoc.success) setSurveyors(surveyorsDoc.surveyors);

        } catch (error) {
            toast.error('System failure: Unable to fetch master ledger');
        } finally {
            setLoading(false);
        }
    };

    const toggleSurveyor = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/surveyors/${id}/toggle`, { method: 'PATCH' });
            const data = await res.json();
            if (data.success) {
                toast.success('Surveyor lifecycle status updated');
                setSurveyors(prev => prev.map(s => s.id === id ? data.surveyor : s));
            }
        } catch (error) {
            toast.error('Protocol error: Toggle failed');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && !stats) {
        return (
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: 2 }}>
                <CircularProgress size={40} sx={{ color: '#1E3A5F' }} />
                <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                    Initializing Admin Protocol...
                </Typography>
            </Box>
        );
    }

    const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '20px' }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</Typography>
                        <Typography variant="h5" fontWeight="900" sx={{ color: '#1E3A5F' }}>{value}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>{sub}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="900" sx={{ color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '-0.02em', mb: 1 }}>
                    Global Command Center
                </Typography>
                <Typography sx={{ color: '#64748B', fontWeight: 700, fontSize: '14px' }}>
                    Master oversight of claims, users, and surveyor network performance.
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Volume" value={stats?.total_claims || 0} sub="Lifetime Claims" icon={ClaimsIcon} color="#2D5F9E" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Settlement Value" value={`₹${((stats?.total_amount_approved || 0) / 100000).toFixed(2)}L`} sub="Disbursed Capital" icon={RupeeIcon} color="#10B981" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="User Network" value={stats?.total_users || 0} sub="Registered Entities" icon={PeopleIcon} color="#F59E0B" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Current Velocity" value={stats?.claims_this_month || 0} sub="Requests This Month" icon={TrendingUpIcon} color="#8B5CF6" />
                </Grid>
            </Grid>

            {/* Master Tables */}
            <Paper sx={{ borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Box sx={{ px: 3, pt: 3, borderBottom: '1px solid #F1F5F9' }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
                        '& .MuiTabs-indicator': { bgcolor: '#1E3A5F', height: 3, borderRadius: '3px 3px 0 0' },
                        '& .MuiTab-root': { fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', '&.Mui-selected': { color: '#1E3A5F' } }
                    }}>
                        <Tab icon={<ClaimsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Claims Ledger" />
                        <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="User Directory" />
                        <Tab icon={<SurveyorIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Surveyor Network" />
                    </Tabs>
                </Box>

                <Box sx={{ p: 2 }}>
                    {tab === 0 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Claimant</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Vehicle</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Value</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {claims.map((claim) => (
                                        <TableRow key={claim.id} hover>
                                            <TableCell sx={{ fontWeight: 800, color: '#1E3A5F', fontSize: '13px', fontFamily: 'monospace' }}>{claim.claim_number}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 700 }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F' }}>{claim.claimant_name}</Typography>
                                                    <Typography sx={{ fontSize: '11px', color: '#64748B' }}>{claim.claimant_email}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px', color: '#475569', fontWeight: 700 }}>{claim.vehicle}</TableCell>
                                            <TableCell sx={{ fontSize: '14px', fontWeight: 900, color: '#1E3A5F' }}>₹{claim.ai_approved_amount?.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>
                                                <Chip label={claim.status.replace('_', ' ').toUpperCase()} size="small" sx={{
                                                    height: 20, fontSize: '9px', fontWeight: 900,
                                                    bgcolor: claim.status === 'approved' ? '#ECFDF5' : claim.status === 'rejected' ? '#FEF2F2' : '#EFF6FF',
                                                    color: claim.status === 'approved' ? '#0F9D6A' : claim.status === 'rejected' ? '#D64045' : '#2D5F9E'
                                                }} />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>{format(new Date(claim.created_at), 'MMM dd, HH:mm')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {tab === 1 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>User Profile</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Claims</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Member Since</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id} hover>
                                            <TableCell>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#F1F5F9', color: '#1E3A5F', fontSize: '12px', fontWeight: 900 }}>{u.full_name[0]}</Avatar>
                                                    <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F' }}>{u.full_name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>{u.email}</TableCell>
                                            <TableCell>
                                                <Chip label={`${u.claim_count} Claims`} size="small" variant="outlined" sx={{ fontWeight: 800, color: '#2D5F9E', borderRadius: '6px' }} />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>{format(new Date(u.created_at), 'MMM dd, yyyy')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {tab === 2 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Surveyor Entity</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>License</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Workload</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Availability</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {surveyors.map((s) => (
                                        <TableRow key={s.id} hover>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1E3A5F' }}>{s.full_name}</Typography>
                                                <Typography sx={{ fontSize: '11px', color: '#64748B' }}>{s.location}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px', fontWeight: 800, color: '#475569', fontFamily: 'monospace' }}>{s.license_number}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: s.assignment_count > 5 ? '#D64045' : '#1E3A5F' }}>
                                                    {s.assignment_count} Active Assignments
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={s.is_available ? 'ONLINE' : 'OFFLINE'}
                                                    size="small"
                                                    sx={{
                                                        height: 20, fontSize: '9px', fontWeight: 900,
                                                        bgcolor: s.is_available ? '#ECFDF5' : '#F1F5F9',
                                                        color: s.is_available ? '#0F9D6A' : '#94A3B8'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={s.is_available ? 'Deactivate Node' : 'Activate Node'}>
                                                    <IconButton onClick={() => toggleSurveyor(s.id)} size="small" sx={{ color: s.is_available ? '#0F9D6A' : '#94A3B8' }}>
                                                        {s.is_available ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
