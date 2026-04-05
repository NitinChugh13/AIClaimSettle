'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  TrendingUp as AccuracyIcon,
  CheckCircle as ComplianceIcon,
  Shield as TrustIcon,
} from '@mui/icons-material';

const advantageCards = [
  {
    icon: SpeedIcon,
    label: 'Speed',
    title: '13-Min Settlement',
    desc: 'Fastest claims processing with AI-powered assessment',
    color: '#3B82F6',
  },
  {
    icon: AccuracyIcon,
    label: 'Accuracy',
    title: 'AI-Powered',
    desc: 'Intelligent damage assessment and repair estimates',
    color: '#06B6D4',
  },
  {
    icon: ComplianceIcon,
    label: 'Compliance',
    title: 'IRDA-Certified',
    desc: 'Fully compliant with IRDA guidelines Section 64UM',
    color: '#0F9D6A',
  },
  {
    icon: TrustIcon,
    label: 'Trust',
    title: 'Bank-Grade Security',
    desc: 'AES-256 encryption with complete audit trails',
    color: '#EF4444',
  },
];

// Counter component with animation
function AnimatedCounter({
  end,
  duration = 2,
  shouldAnimate = true,
}: {
  end: number;
  duration?: number;
  shouldAnimate?: boolean;
}) {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible || !shouldAnimate) return;

    let start = 0;
    const increment = end / (duration * 60);
    let currentValue = 0;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration, shouldAnimate]);

  return <span ref={elementRef}>{count}</span>;
}

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animateStats, setAnimateStats] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, sm: 10, md: 12 },
        pb: { xs: 8, sm: 10, md: 12 },
        background: `
          linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(6, 182, 212, 0.04) 50%, rgba(30, 64, 175, 0.03) 100%),
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
          #FFFFFF
        `,
        backgroundAttachment: 'fixed',
        minHeight: '90vh',
      }}
    >
      {/* Cool Grid Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Animated Gradient Blobs */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: { xs: '200px', sm: '300px', md: '400px' },
          height: { xs: '200px', sm: '300px', md: '400px' },
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: { xs: '200px', sm: '300px', md: '400px' },
          height: { xs: '200px', sm: '300px', md: '400px' },
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Main Heading */}
          <motion.div variants={itemVariants}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                textAlign: 'center',
                mb: 2,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 60%, #3B82F6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI-Powered Claims Settlement
            </Typography>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={itemVariants}>
            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: '#475569',
                textAlign: 'center',
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Settle claims in 13 minutes with AI-powered assessment, no surveyor needed. Upload photos, get instant
              verification, and receive settlement securely.
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 8,
              }}
            >
              <Button
                component={Link}
                href="/claim/new"
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: '8px',
                  boxShadow: '0 10px 28px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                    boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <svg width={18} height={18} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                  <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Launch Nova Strike
              </Button>
              <Button
                component={Link}
                href="/claim/track"
                variant="outlined"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  color: '#3B82F6',
                  borderColor: '#3B82F6',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: '8px',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1E40AF',
                    color: '#1E40AF',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  },
                }}
              >
                📡 Track My Claim
              </Button>
            </Box>
          </motion.div>

          {/* Advantage Cards Marquee */}
          <motion.div variants={itemVariants}>
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              mt: { xs: 2, md: 4 },
              mb: { xs: 4, md: 6 },
            }}
          >
              <motion.div
                animate={{
                  x: [0, -1200],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  display: 'flex',
                  gap: 16,
                  width: 'max-content',
                }}
              >
                {[...advantageCards, ...advantageCards].map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <Box
                      key={index}
                      sx={{
                        minWidth: { xs: '240px', sm: '260px', md: '280px' },
                        flexShrink: 0,
                      }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.7)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(59, 130, 246, 0.15)',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: card.color,
                            boxShadow: `0 20px 25px ${card.color}20`,
                            transform: 'translateY(-8px)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center' }}>
                          {/* Icon */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              mb: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: '10px',
                                background: `${card.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconComponent
                                sx={{
                                  fontSize: '1.5rem',
                                  color: card.color,
                                }}
                              />
                            </Box>
                          </Box>

                          {/* Label */}
                          <Typography
                            sx={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: card.color,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              mb: 0.75,
                            }}
                          >
                            {card.label}
                          </Typography>

                          {/* Title */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              fontWeight: 700,
                              color: '#0F172A',
                              mb: 0.75,
                              lineHeight: 1.3,
                            }}
                          >
                            {card.title}
                          </Typography>

                          {/* Description */}
                          <Typography
                            sx={{
                              fontSize: { xs: '0.8rem', md: '0.85rem' },
                              color: '#64748B',
                              lineHeight: 1.4,
                              fontWeight: 500,
                            }}
                          >
                            {card.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </motion.div>
            </Box>
          </motion.div>

          {/* Trust Indicators - Animated Stats */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1.5, sm: 3, md: 6 },
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 6,
                pt: 4,
                borderTop: '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              {/* Stat 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={animateStats ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ textAlign: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.2rem' },
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <AnimatedCounter end={12400} duration={2.5} shouldAnimate={animateStats} />
                  <span style={{ fontSize: '0.6em' }}>+</span>
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' }, color: '#64748B', mt: 0.75, fontWeight: 600 }}>
                  Claimants Served
                </Typography>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={animateStats ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.2rem' },
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AnimatedCounter end={13} duration={2.5} shouldAnimate={animateStats} />
                  <span style={{ fontSize: '0.7em', fontWeight: 700 }}>min</span>
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' }, color: '#64748B', mt: 0.75, fontWeight: 600 }}>
                  Average Settlement
                </Typography>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={animateStats ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ textAlign: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.2rem' },
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  IRDA
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' }, color: '#64748B', mt: 0.75, fontWeight: 600 }}>
                  Fully Compliant
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
