'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { motion, useInView, AnimatePresence, useScroll } from 'framer-motion';
import Link from 'next/link';

// --- Sub-components ---

const LightningFlash = () => {
    const [flash, setFlash] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            setFlash(true);
            setTimeout(() => setFlash(false), 600);
        }
    }, [isInView]);

    return (
        <Box ref={ref} sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 50,
            bgcolor: flash ? '#1E3A8A' : 'transparent',
            transition: 'background-color 0.1s ease-out',
            opacity: flash ? 0.3 : 0
        }}>
            <AnimatePresence>
                {isInView && (
                    <motion.svg
                        style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', overflow: 'visible' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                    >
                        <motion.path
                            d="M 0 0 L 1000 0"
                            stroke="#3B82F6"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ filter: 'drop-shadow(0 0 8px #3B82F6)' }}
                        />
                    </motion.svg>
                )}
            </AnimatePresence>
        </Box>
    );
};

const HeadlineCollision = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [collided, setCollided] = useState(false);

    useEffect(() => {
        if (isInView) {
            setTimeout(() => setCollided(true), 600);
        }
    }, [isInView]);

    const wordVariants = {
        nova: {
            initial: { x: -200, opacity: 0 },
            animate: { x: collided ? 0 : -50, opacity: 1 },
        },
        strike: {
            initial: { x: 200, opacity: 0 },
            animate: { x: collided ? 0 : 50, opacity: 1 },
        }
    };

    return (
        <Box ref={ref} sx={{ textAlign: 'center', py: 8, overflow: 'hidden', position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
            >
                <Typography variant="overline" sx={{ color: '#06B6D4', letterSpacing: '0.3em', fontWeight: 'bold' }}>
                    ⚡ INTRODUCING
                </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 1, md: 3 }, mt: 2, position: 'relative' }}>
                <motion.div
                    variants={wordVariants.nova}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3rem', md: '6rem' },
                            fontWeight: 900,
                            color: collided ? '#3B82F6' : 'white',
                            textShadow: collided ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none',
                            transition: 'color 0.3s ease, text-shadow 0.3s ease'
                        }}
                    >
                        NOVA
                    </Typography>
                </motion.div>

                <motion.div
                    variants={wordVariants.strike}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3rem', md: '6rem' },
                            fontWeight: 900,
                            color: collided ? '#06B6D4' : 'white',
                            textShadow: collided ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
                            transition: 'color 0.3s ease, text-shadow 0.3s ease'
                        }}
                    >
                        STRIKE
                    </Typography>
                </motion.div>

                {collided && (
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{
                                    x: (Math.random() - 0.5) * 300,
                                    y: (Math.random() - 0.5) * 300,
                                    opacity: 0,
                                    scale: 0
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{
                                    position: 'absolute', width: 6, height: 6, borderRadius: '50%',
                                    backgroundColor: i % 2 === 0 ? '#3B82F6' : '#06B6D4'
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Box sx={{ mt: 2, height: '2rem' }}>
                {collided && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Typography variant="h6" sx={{ color: '#94A3B8', fontStyle: 'italic', fontWeight: 400 }}>
                            {"India's first autonomous motor claim engine.".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.04) }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </Typography>
                    </motion.div>
                )}
            </Box>
        </Box>
    );
};

const SpeedRace = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const [key, setKey] = useState(0);

    const replay = () => setKey(prev => prev + 1);

    return (
        <Box ref={ref} sx={{ py: 8, maxWidth: 800, mx: 'auto', px: 2 }}>
            <Box key={key} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Traditional Lane */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: 1 }}>
                            🐢 Traditional Insurance Claim
                        </Typography>
                        {isInView && (
                            <Typography variant="caption" sx={{ color: '#EF4444', fontFamily: 'monospace' }}>
                                <CountUp end={14} duration={8} prefix="Day " suffix="..." />
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8 }}> Still waiting</motion.span>
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ height: 12, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={isInView ? { width: '60%' } : { width: '0%' }}
                            transition={{ duration: 8, ease: "linear" }}
                            style={{ height: '100%', backgroundColor: '#EF4444' }}
                        />
                        {isInView && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 8 }}
                                style={{ position: 'absolute', right: 10, top: 0, height: '100%', display: 'flex', alignItems: 'center' }}
                            >
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>❌ STOPPED</Typography>
                            </motion.div>
                        )}
                    </Box>
                </Box>

                {/* Nova Strike Lane */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <svg width={16} height={16} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Nova Strike by ClaimNova
                        </Typography>
                        {isInView && (
                            <Typography variant="caption" sx={{ color: '#3B82F6', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                <CountUp end={13} duration={1.5} suffix=" min" />
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}> ✅ DONE</motion.span>
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ height: 16, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, overflow: 'hidden', position: 'relative', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}>
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={isInView ? { width: '100%' } : { width: '0%' }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            style={{
                                height: '100%', background: 'linear-gradient(90deg, #1D4ED8, #3B82F6)',
                                boxShadow: '0 0 20px #3B82F6'
                            }}
                        />
                        {isInView && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.5, type: 'spring' }}
                                style={{ position: 'absolute', right: 10, top: 0, height: '100%', display: 'flex', alignItems: 'center' }}
                            >
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>SETTLED ✅</Typography>
                            </motion.div>
                        )}
                    </Box>
                </Box>

                <Button
                    size="small"
                    variant="text"
                    onClick={replay}
                    sx={{ color: '#94A3B8', alignSelf: 'center', mt: -2, textTransform: 'none' }}
                >
                    🔄 Race Again
                </Button>
            </Box>
        </Box>
    );
};

const CountUp = ({ end, duration, prefix = "", suffix = "" }: { end: number, duration: number, prefix?: string, suffix?: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const currentCount = Math.min(Math.floor((progress / (duration * 1000)) * end), end);
            setCount(currentCount);

            if (currentCount < end) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{prefix}{count}{suffix}</span>;
}

const FloatingPills = () => {
    const pills = [
        { icon: '📸', head: 'Photo → Assessment', sub: 'AI reads damage in seconds', color: '#3B82F6' },
        { icon: '⚡', head: '13 Minutes', sub: 'Average settlement time', color: '#06B6D4', large: true },
        { icon: '🏦', head: 'Direct Bank Transfer', sub: 'No middlemen. No delays.', color: '#10B981' },
    ];

    return (
        <Grid container spacing={4} sx={{ mt: 8, justifyContent: 'center' }}>
            {pills.map((pill, i) => (
                <Grid size={{ xs: 12, md: pill.large ? 4 : 3.5 }} key={i}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Box
                            sx={{
                                p: 3, borderRadius: 8, bgcolor: 'rgba(30, 41, 59, 0.4)',
                                border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                                textAlign: 'center', transition: 'all 0.3s ease',
                                position: 'relative', overflow: 'hidden',
                                boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)`,
                                '&:hover': {
                                    transform: 'translateY(-10px) scale(1.05)',
                                    borderColor: pill.color,
                                    boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 20px ${pill.color}22`
                                },
                                animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        >
                            <Box sx={{
                                width: 48, height: 48, mx: 'auto', borderRadius: '50%',
                                bgcolor: `${pill.color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', mb: 2, border: `1px solid ${pill.color}33`,
                                animation: pill.large ? 'pulse-glow 2s infinite' : 'none'
                            }}>
                                {pill.icon}
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>{pill.head}</Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>{pill.sub}</Typography>
                        </Box>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
};

const LiveCounterStrip = () => {
    const stats = [
        { label: 'Claims Settled', value: 12400, suffix: '+', icon: '⚡' },
        { label: 'Auto-Approved', value: 78, suffix: '%', icon: '🤖' },
        { label: 'Avg Time', value: 13, suffix: ' Min', icon: '⏱' },
        { label: 'Claims (Cr)', value: 4.2, suffix: '', icon: '💰', prefix: '₹' },
    ];

    return (
        <Box sx={{ bgcolor: '#111827', py: 4, mt: 12, borderY: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex', flexWrap: 'nowrap', justifyContent: { xs: 'flex-start', md: 'space-around' },
                    gap: { xs: 8, md: 4 },
                    animation: { xs: 'marquee 20s linear infinite', md: 'none' }
                }}>
                    {stats.map((stat, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                            <Typography variant="h4" sx={{ color: '#3B82F6', fontSize: '1.2rem' }}>{stat.icon}</Typography>
                            <Box>
                                <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>
                                    {stat.prefix}<CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
                            </Box>
                            {i < stats.length - 1 && (
                                <Box sx={{ display: { xs: 'none', md: 'block' }, width: '1px', height: 40, bgcolor: 'rgba(255,255,255,0.1)', ml: 4 }} />
                            )}
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

const NovaStrikeCTA = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box sx={{ mt: 16, textAlign: 'center', position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <Box sx={{
                    maxWidth: 800, mx: 'auto', p: { xs: 4, md: 8 }, borderRadius: 8,
                    background: 'radial-gradient(circle at center, #1E3A8A 0%, #0A0F1E 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>Had an Accident? Don't Wait.</Typography>
                    <Typography variant="h6" sx={{ color: '#94A3B8', mb: 6 }}>
                        Launch Nova Strike and get settled before your chai gets cold. ☕
                    </Typography>

                    <Button
                        component={Link}
                        href="/claim/new"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{
                            py: 2.5, px: { xs: 4, md: 10 }, fontSize: '1.2rem', fontWeight: 900,
                            borderRadius: 4, background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
                            color: 'white', textTransform: 'none',
                            boxShadow: isHovered ? '0 0 40px rgba(59,130,246,0.6)' : '0 10px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            position: 'relative', overflow: 'hidden',
                            '&::after': {
                                content: '""', position: 'absolute', top: 0, left: '-100%',
                                width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                animation: 'shimmer-button 3s infinite'
                            }
                        }}
                    >
                        ⚡ Launch Nova Strike
                    </Button>
                </Box>
            </motion.div>
        </Box>
    );
};

// --- Main component ---

export default function NovaStrikeSection() {
    const { scrollYProgress } = useScroll(); // For scroll effects
    const theme = useTheme();

    return (
        <Box id="nova-strike" sx={{
            position: 'relative', bgcolor: '#0A0F1E', color: 'white', py: 16,
            minHeight: '100vh', overflow: 'hidden'
        }}>
            <LightningFlash />

            <Container maxWidth="lg">
                <HeadlineCollision />
                <SpeedRace />
                <FloatingPills />
                <LiveCounterStrip />
                <NovaStrikeCTA />
            </Container>

            {/* Background elements */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none', opacity: 0.1, zIndex: 0,
                background: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            {/* Global animations required for this section */}
            <style jsx global>{`
                @keyframes float {
                    from { transform: translateY(0); }
                    to { transform: translateY(-15px); }
                }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(6, 182, 212, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes shimmer-button {
                    0% { left: -100%; }
                    30% { left: 100%; }
                    100% { left: 100%; }
                }
            `}</style>
        </Box>
    );
}
