'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    Grid,
    Card,
    CardContent,
    Button,
    Slider,
    Chip,
    Alert,
    AlertTitle,
    IconButton,
    Paper,
    Divider,
    Fade,
    Avatar
} from '@mui/material';
import {
    Save as SaveIcon,
    Settings as SettingsIcon,
    Shield as ShieldIcon,
    Gavel as RuleIcon,
    WarningAmber as WarningIcon,
    InfoOutlined as InfoIcon,
    Refresh as ResetIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';

const DECISION_RULES = [
    { key: 'confidence_threshold', label: 'Auto-approve confidence threshold', value: 75, min: 60, max: 95, unit: '%', description: 'Claims above this AI confidence score are auto-approved' },
    { key: 'fraud_score_limit', label: 'Fraud score limit for auto-approve', value: 25, min: 10, max: 50, unit: '/100', description: 'Claims below this fraud score are eligible for auto-approval' },
    { key: 'high_value_threshold', label: 'High-value review threshold', value: 15000, min: 10000, max: 20000, unit: '₹', description: 'Claims above this amount trigger officer review regardless of AI score' },
    { key: 'exif_time_window', label: 'EXIF timestamp tolerance', value: 72, min: 24, max: 168, unit: 'hrs', description: 'Max hours between photo timestamp and incident date' },
];

export default function AdminRulesPage() {
    const [rules, setRules] = useState(DECISION_RULES.map(r => ({ ...r })));
    const [hasChanges, setHasChanges] = useState(false);

    const handleRuleChange = (key: string, val: number) => {
        setRules(prev => prev.map(r => r.key === key ? { ...r, value: val } : r));
        setHasChanges(true);
    };

    const handleSave = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Updating protocol nodes...',
            success: 'Neural Decision Engine Recalibrated',
            error: 'Adjustment failed',
        });
        setHasChanges(false);
    };

    const handleReset = () => {
        setRules(DECISION_RULES.map(r => ({ ...r })));
        setHasChanges(false);
        toast.info('Restored default system parameters');
    };

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
            {/* Header Area */}
            <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', py: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
                <Container maxWidth="xl">
                    <Grid container spacing={3} alignItems="flex-end" justifyContent="space-between">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <RuleIcon sx={{ fontSize: 20, color: '#2D5F9E' }} />
                                <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#2D5F9E' }}>
                                    Neural Governance
                                </Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase', mb: 1 }}>
                                Decision Engine
                            </Typography>
                            <Typography sx={{ color: '#64748B', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Configure protocol thresholds & automated settlement logic.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Stack direction="row" spacing={2} justifyContent={{ md: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleReset}
                                    sx={{
                                        height: 48,
                                        px: 3,
                                        borderRadius: '12px',
                                        borderColor: '#E2E8F0',
                                        color: '#64748B',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                                    }}
                                    startIcon={<ResetIcon sx={{ fontSize: 18 }} />}
                                >
                                    Defaults
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={!hasChanges}
                                    onClick={handleSave}
                                    sx={{
                                        height: 48,
                                        px: 4,
                                        borderRadius: '12px',
                                        bgcolor: '#2D5F9E',
                                        boxShadow: '0 8px 20px rgba(45, 95, 158, 0.2)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        '&:hover': { bgcolor: '#1E3A5F' },
                                        '&.Mui-disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' }
                                    }}
                                    startIcon={<SaveIcon />}
                                >
                                    Commit Parameters
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl">
                <Alert
                    severity="warning"
                    icon={<WarningIcon />}
                    sx={{
                        mb: 4,
                        borderRadius: '20px',
                        border: '1px solid #FEF3C7',
                        bgcolor: '#FFFBEB',
                        '& .MuiAlert-message': { width: '100%' }
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}>Operational Risk Advisory</AlertTitle>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>
                        Adjusting neural weights directly impacts settlement volume. Lowering confidence requirements may increase fiscal exposure.
                    </Typography>
                </Alert>

                <Grid container spacing={3}>
                    {rules.map((rule) => (
                        <Grid size={{ xs: 12, md: 6 }} key={rule.key}>
                            <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', transition: 'all 0.2s', '&:hover': { borderColor: '#2D5F9E', boxShadow: '0 10px 30px rgba(45, 95, 158, 0.05)' } }}>
                                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase' }}>
                                                {rule.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', mt: 0.5 }}>
                                                {rule.description}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={rule.unit === '₹' ? `₹${rule.value.toLocaleString('en-IN')}` : `${rule.value}${rule.unit}`}
                                            sx={{
                                                borderRadius: '10px',
                                                bgcolor: '#F0F6FF',
                                                color: '#2D5F9E',
                                                fontWeight: 900,
                                                fontSize: '14px',
                                                height: 36,
                                                border: '1px solid #DBEAFE'
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ px: 1, py: 2 }}>
                                        <Slider
                                            value={rule.value}
                                            min={rule.min}
                                            max={rule.max}
                                            step={rule.key === 'high_value_threshold' ? 500 : 1}
                                            onChange={(_, val) => handleRuleChange(rule.key, val as number)}
                                            sx={{
                                                color: '#2D5F9E',
                                                height: 8,
                                                '& .MuiSlider-track': { border: 'none' },
                                                '& .MuiSlider-thumb': {
                                                    width: 24,
                                                    height: 24,
                                                    backgroundColor: '#fff',
                                                    border: '2px solid currentColor',
                                                    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                                        boxShadow: 'inherit',
                                                    },
                                                    '&::before': { display: 'none' },
                                                },
                                                '& .MuiSlider-valueLabel': {
                                                    lineHeight: 1.2,
                                                    fontSize: 12,
                                                    background: 'unset',
                                                    padding: 0,
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50% 50% 50% 0',
                                                    backgroundColor: '#2D5F9E',
                                                    transformOrigin: 'bottom left',
                                                    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                                                    '&::before': { display: 'none' },
                                                    '&.MuiSlider-valueLabelOpen': {
                                                        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                                                    },
                                                    '& > *': {
                                                        transform: 'rotate(45deg)',
                                                    },
                                                },
                                            }}
                                        />
                                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8' }}>
                                                {rule.unit === '₹' ? `₹${rule.min.toLocaleString('en-IN')}` : `${rule.min}${rule.unit}`}
                                            </Typography>
                                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8' }}>
                                                {rule.unit === '₹' ? `₹${rule.max.toLocaleString('en-IN')}` : `${rule.max}${rule.unit}`}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#FFFFFF' }}>
                    <Avatar sx={{ width: 44, height: 44, bgcolor: '#F0F9FF', color: '#0EA5E9' }}>
                        <InfoIcon />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#1E3A5F' }}>Protocol Version Node: v4.2.0-STABLE</Typography>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>Last adjustment recorded 14 sessions ago by System Root</Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
