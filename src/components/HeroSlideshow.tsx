'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, Box, Container, Chip, Grid } from '@mui/material';
import Link from 'next/link';
import {
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const slides = [
    {
        id: 0,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600',
        badge: '⚡ Nova Strike — Live',
        headline: 'Accident Happened?',
        subheadline: 'File your claim in 60 seconds. AI assesses damage instantly.',
    },
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600',
        badge: '🤖 AI-Powered Assessment',
        headline: 'No Surveyor. No Waiting.',
        subheadline: 'ClaimNova\'s AI reads your photos and auto-approves claims up to ₹20,000.',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600',
        badge: '📱 File From Anywhere',
        headline: 'Accident on Highway?',
        subheadline: 'Open ClaimNova. Upload photos. Get approved before you reach the garage.',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600',
        badge: '💰 Instant Transfer',
        headline: 'Settlement in 13 Minutes.',
        subheadline: 'Payment directly to your bank. No middlemen. No delays. Just Nova Strike.',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600',
        badge: '🛡️ IRDA Authorised',
        headline: 'India\'s Most Trusted Claim Engine.',
        subheadline: 'Serving 12,400+ claimants. DataSafe certified. 100% compliant with IRDA norms.',
    }
];

export default function HeroSlideshow() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    // Animation variants
    const bgVariants = {
        initial: { scale: 1.08, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' as any } },
        exit: { scale: 0.96, opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' as any } }
    };

    const textVariants = {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
    };

    const heroProofs = [
        'IRDA-Aligned Workflow',
        '13-Min Avg Settlement',
        'Bank-Grade Data Security',
    ];

    return (
        <Box sx={{ position: 'relative', width: '100%', minHeight: { xs: '88vh', md: '100vh' }, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>

            {/* Background Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    variants={bgVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </AnimatePresence>

            {/* Dark Overlay gradient */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, background: 'linear-gradient(to bottom, rgba(10,15,30,0.55) 0%, rgba(10,15,30,0.85) 100%)' }} />

            {/* Content */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 20, pt: { xs: 11, md: 10 }, pb: { xs: 6, md: 8 } }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <AnimatePresence mode="wait">
                            <motion.div key={`content-${slide.id}`} initial="initial" animate="animate" exit="exit" variants={{
                                initial: { opacity: 0 },
                                animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
                                exit: { opacity: 0 }
                            }}>
                                <motion.div variants={{ initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 } }}>
                                    <Chip label={slide.badge} variant="outlined" sx={{ borderColor: 'info.main', color: 'info.main', mb: { xs: 2, md: 3 }, fontWeight: 'bold', boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)', maxWidth: '100%', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, '& .MuiChip-label': { whiteSpace: 'normal', display: 'block', px: { xs: 1, md: 1.5 } } }} icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', ml: 1, animation: 'pulse-ring 2s infinite' }} />} />
                                </motion.div>

                                <motion.div variants={textVariants}>
                                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.6rem', md: '4.5rem' }, lineHeight: 1.1, color: 'white' }}>
                                        {slide.headline.split(' ').map((word, i) => (
                                            <motion.span key={i} style={{ display: 'inline-block', marginRight: '0.4em' }}
                                                initial={{ y: 30, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.08 + 0.3 }}
                                            >
                                                {word}
                                            </motion.span>
                                        ))}
                                    </Typography>
                                </motion.div>

                                <motion.div variants={textVariants} transition={{ delay: 0.5 }}>
                                    <Typography variant="h6" sx={{ color: 'rgba(224, 236, 255, 0.85)', mb: 4, fontWeight: 400, maxWidth: 650, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                        {slide.subheadline}
                                    </Typography>
                                </motion.div>

                                <motion.div variants={textVariants} transition={{ delay: 0.7 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 }, mb: 4 }}>
                                        <Button component={Link} href="/claim/new" variant="contained" color="primary" size="large" sx={{ flex: { xs: '1 1 100%', sm: '0 1 auto' }, px: { xs: 3, md: 4 }, py: { xs: 1.25, md: 1.5 }, fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }, fontWeight: 700, borderRadius: 2.5, boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', '&:hover': { boxShadow: '0 12px 30px rgba(59, 130, 246, 0.5)', background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }, display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
                                            <svg width={16} height={16} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '16px' }}>
                                              <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span style={{ whiteSpace: 'nowrap' }}>Launch Nova Strike</span>
                                        </Button>
                                        <Button component={Link} href="/claim/track" variant="outlined" size="large" sx={{ flex: { xs: '1 1 100%', sm: '0 1 auto' }, color: 'white', borderColor: 'rgba(255,255,255,0.55)', px: { xs: 3, md: 4 }, py: { xs: 1.25, md: 1.5 }, fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }, fontWeight: 600, borderRadius: 2.5, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                            📡 <span style={{ whiteSpace: 'nowrap' }}>Track My Claim</span>
                                        </Button>
                                    </Box>
                                </motion.div>

                                <motion.div variants={textVariants} transition={{ delay: 0.9 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1, md: 1.25 } }}>
                                        {heroProofs.map((proof) => (
                                            <Chip
                                                key={proof}
                                                label={proof}
                                                variant="outlined"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.92)',
                                                    borderColor: 'rgba(148, 163, 184, 0.45)',
                                                    bgcolor: 'rgba(15, 23, 42, 0.35)',
                                                    backdropFilter: 'blur(6px)',
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                                                    letterSpacing: 0.1,
                                                    '& .MuiChip-label': { px: { xs: 0.75, sm: 1, md: 1.25 } }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </Grid>
                </Grid>
            </Container>

            {/* Slide Indicators */}
            <Box sx={{ position: 'absolute', bottom: { xs: 16, sm: 24, md: 32 }, left: 0, right: 0, zIndex: 30, display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 1.5, md: 2 } }}>
                {slides.map((s, i) => (
                    <Box
                        key={s.id}
                        onClick={() => setCurrent(i)}
                        sx={{
                            width: current === i ? { xs: 24, md: 32 } : { xs: 8, md: 12 },
                            height: { xs: 8, md: 12 },
                            borderRadius: 6,
                            bgcolor: current === i ? 'primary.main' : 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                            boxShadow: current === i ? '0 0 10px rgba(59, 130, 246, 0.8)' : 'none'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
