'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Slider,
    Chip,
    Alert,
    AlertTitle,
} from '@mui/material';
import {
    Save as SaveIcon,
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
        toast.success('Decision rules updated successfully');
        setHasChanges(false);
    };

    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-start' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Decision Rules Engine</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Configure threshold limits for the AI auto-approval system.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={!hasChanges}
                    onClick={handleSave}
                    sx={{ height: 44 }}
                >
                    Save Configuration
                </Button>
            </Box>

            <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                <AlertTitle sx={{ fontWeight: 'bold' }}>Warning</AlertTitle>
                Adjusting these rules directly impacts the volume of auto-approved claims. Lowering confidence thresholds or increasing fraud limits may increase financial risk.
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {rules.map(rule => (
                    <Card key={rule.key} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, '&:hover': { borderColor: 'primary.light' } }}>
                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">{rule.label}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{rule.description}</Typography>
                                </Box>
                                <Chip
                                    label={rule.unit === '₹' ? `₹${rule.value.toLocaleString('en-IN')}` : `${rule.value}${rule.unit}`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold', fontSize: '1rem', height: 32, bgcolor: 'rgba(30, 58, 95, 0.05)' }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 1 }}>
                                <Typography variant="caption" fontWeight="bold" color="text.disabled" sx={{ minWidth: 40, textAlign: 'right' }}>
                                    {rule.unit === '₹' ? `₹${rule.min.toLocaleString('en-IN')}` : `${rule.min}${rule.unit}`}
                                </Typography>
                                <Slider
                                    value={rule.value}
                                    min={rule.min}
                                    max={rule.max}
                                    step={rule.key === 'high_value_threshold' ? 500 : 1}
                                    onChange={(_, val) => handleRuleChange(rule.key, val as number)}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(val) => rule.unit === '₹' ? `₹${val.toLocaleString('en-IN')}` : `${val}${rule.unit}`}
                                    sx={{ flex: 1 }}
                                />
                                <Typography variant="caption" fontWeight="bold" color="text.disabled" sx={{ minWidth: 40 }}>
                                    {rule.unit === '₹' ? `₹${rule.max.toLocaleString('en-IN')}` : `${rule.max}${rule.unit}`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
