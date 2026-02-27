'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    { name: 'Rahul Sharma', city: 'Mumbai', vehicle: 'Maruti Swift', amount: '₹12,400', time: '11 minutes', rating: 5, text: 'Could not believe my claim was settled in 11 minutes! The AI was thorough and the amount matched what the garage quoted.' },
    { name: 'Priya Menon', city: 'Bangalore', vehicle: 'Hyundai i20', amount: '₹8,750', time: '8 minutes', rating: 5, text: 'Had an accident on the highway. Filed claim while still at the spot. Settlement was already approved by the time I reached the garage!' },
    { name: 'Vikram Patel', city: 'Delhi', vehicle: 'Honda City', amount: '₹19,200', time: '34 minutes', rating: 4, text: 'Mine went to officer review because the amount was close to ₹20,000. Still settled same day. Much better than waiting 3 weeks!' },
];

export default function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const slideVariants = {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
        exit: { x: -100, opacity: 0, transition: { duration: 0.5 } }
    };

    const t = testimonials[current];

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 700, mx: 'auto', minHeight: { xs: 360, sm: 310 }, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ width: '100%', position: 'absolute' }}
                >
                    <Card sx={{
                        bgcolor: '#0F1A2E',
                        borderRadius: 4,
                        border: '1px solid rgba(103, 232, 249, 0.22)',
                        background: 'linear-gradient(145deg, #0F1A2E 0%, #111F36 100%)',
                        boxShadow: '0 12px 30px rgba(3, 10, 24, 0.45)',
                        position: 'relative'
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)' }} />
                        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                            <Box sx={{ display: 'flex', mb: 3 }}>
                                {[...Array(t.rating)].map((_, j) => (
                                    <StarIcon key={j} sx={{ color: '#fbbf24', fontSize: 24 }} />
                                ))}
                            </Box>
                            <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 4, fontWeight: 400, lineHeight: 1.6, color: 'rgba(236, 245, 255, 0.95)', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                "{t.text}"
                            </Typography>
                            <Divider sx={{ mb: 3, borderColor: 'rgba(148, 163, 184, 0.26)' }} />
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#E6F0FF' }}>{t.name}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(196, 212, 235, 0.85)' }}>{t.city} • {t.vehicle}</Typography>
                                </Box>
                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, bgcolor: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.28)', px: 2, py: 1, borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#67E8F9' }} fontWeight="bold">{t.amount}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(196, 212, 235, 0.85)' }}>in {t.time}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1, pb: 1 }}>
                {testimonials.map((_, i) => (
                    <Box
                        key={i}
                        onClick={() => setCurrent(i)}
                        sx={{
                            width: current === i ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: current === i ? '#2D5F9E' : 'rgba(45, 95, 158, 0.25)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
