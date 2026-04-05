'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';

const FraudDetectionSection = () => {
  const [displayedClaims, setDisplayedClaims] = useState([
    { name: 'Rahul M., Delhi', amt: '₹42,000', status: 'safe', init: 'RM' },
  ]);
  
  const [stats, setStats] = useState({
    fraudsBlocked: 0,
    accuracy: 0,
    croreSaved: 0,
    scanSpeed: 0,
  });

  const [barsAnimated, setBarsAnimated] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  const claimsPool = [
    { name: 'Rahul M., Delhi', amt: '₹42,000', status: 'safe', init: 'RM' },
    { name: 'Priya S., Mumbai', amt: '₹1,18,000', status: 'fraud', init: 'PS' },
    { name: 'Amir K., Pune', amt: '₹28,500', status: 'safe', init: 'AK' },
    { name: 'Sunita R., Jaipur', amt: '₹67,000', status: 'review', init: 'SR' },
    { name: 'Vikram T., Hyd', amt: '₹2,30,000', status: 'fraud', init: 'VT' },
    { name: 'Meena P., Blr', amt: '₹19,200', status: 'safe', init: 'MP' },
  ];

  const signals = [
    { label: 'Claim history', value: 88, color: '#10B981' },
    { label: 'Photo metadata', value: 95, color: '#10B981' },
    { label: 'Damage pattern', value: 72, color: '#F59E0B' },
    { label: 'Repair cost match', value: 91, color: '#10B981' },
    { label: 'Location verify', value: 33, color: '#EF4444' },
    { label: 'Policy age', value: 60, color: '#F59E0B' },
    { label: 'Network linkage', value: 22, color: '#EF4444' },
  ];

  // Live claim feed
  useEffect(() => {
    const interval = setInterval(() => {
      const randomClaim = claimsPool[Math.floor(Math.random() * claimsPool.length)];
      setDisplayedClaims((prev) => {
        const updated = [randomClaim, ...prev];
        return updated.slice(0, 5);
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Stat counters
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setStats({
        fraudsBlocked: Math.floor(3847 * progress),
        accuracy: Math.floor(94 * progress),
        croreSaved: Math.floor(12 * progress),
        scanSpeed: Math.floor((2800 / 60) * progress),
      });

      if (progress === 1) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Signal bars animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setBarsAnimated(true);
              });
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (barsRef.current) {
      observer.observe(barsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'fraud': return '#FEE2E2';
      case 'safe': return '#DCFCE7';
      case 'review': return '#FEF3C7';
      default: return '#F3F4F6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fraud': return '#991B1B';
      case 'safe': return '#065F46';
      case 'review': return '#92400E';
      default: return '#4B5563';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'fraud') {
      return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (status === 'safe') {
      return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseAlert {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
        @keyframes cometSpin {
          to {
            transform: rotate(360deg);
          }
        }
        .claim-item {
          animation: slideInUp 0.4s ease-out;
        }
        .alert-icon {
          animation: pulseAlert 2s infinite;
        }
      `}</style>

      <Box sx={{ 
        py: { xs: 2, sm: 3, md: 5 }, 
        px: { xs: 2, md: 0 },
        bgcolor: '#F7FAFF',
        borderTop: '1px solid #CBD8EA',
        borderBottom: '1px solid #CBD8EA',
        position: 'relative' 
      }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: '#FEE2E2',
                color: '#991B1B',
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                borderRadius: 20,
                fontWeight: 600,
                fontSize: { xs: '0.65rem', sm: '0.78rem' },
                mb: { xs: 1, md: 1.5 },
              }}
            >
              <svg width="11" height="11" viewBox="0 0 32 32" fill="none">
                <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="#991B1B" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              AI FRAUD SHIELD
            </Box>
            <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.7rem' }, fontWeight: 800, color: '#1A2B3C', mb: 0.25 }}>
              Real-time fraud detection.
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.95rem', sm: '1.2rem', md: '1.5rem' }, fontWeight: 800, color: '#2D5F9E', mb: { xs: 0.5, md: 0.75 } }}>
              Before it costs you.
            </Typography>
            <Typography sx={{ color: '#4A6080', fontSize: { xs: '0.75rem', sm: '0.82rem' }, maxWidth: '600px', mx: 'auto' }}>
              Every claim is scanned by 7 AI signals in under 3 seconds — catching fraud humans never would.
            </Typography>
          </Box>

          {/* Stats Row */}
          <Box
            sx={{
              mb: 3,
              bgcolor: 'white',
              border: '1px solid #CBD8EA',
              borderRadius: '16px',
              p: { xs: 1, sm: 1.5, md: 1.5 },
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 0.5, sm: 0 },
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(30,58,95,0.06)',
            }}
          >
            <Box sx={{ p: { xs: 1, sm: 1.5 }, textAlign: 'center', borderRight: { xs: 'none', md: '1px solid #CBD8EA' }, borderBottom: { xs: '1px solid #CBD8EA', md: 'none' } }}>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }, fontWeight: 800, color: '#2563EB' }}>
                {stats.fraudsBlocked.toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.65rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.4 }}>
                Frauds Blocked
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 1, sm: 1.5 }, textAlign: 'center', borderRight: { xs: 'none', md: '1px solid #CBD8EA' }, borderBottom: { xs: '1px solid #CBD8EA', md: 'none' } }}>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }, fontWeight: 800, color: '#10B981' }}>
                {stats.accuracy}%
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.65rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.4 }}>
                Detection Accuracy
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 1, sm: 1.5 }, textAlign: 'center', borderRight: { xs: 'none', md: '1px solid #CBD8EA' } }}>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }, fontWeight: 800, color: '#F59E0B' }}>
                ₹{stats.croreSaved}Cr
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.65rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.4 }}>
                Crore Saved
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 1, sm: 1.5 }, textAlign: 'center' }}>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }, fontWeight: 800, color: '#2563EB' }}>
                {(stats.scanSpeed / 1000).toFixed(1)}s
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.65rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.4 }}>
                Scan Speed
              </Typography>
            </Box>
          </Box>

          {/* Live Feed + AI Signals */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Live Claim Feed */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ 
                bgcolor: 'white',
                border: '1px solid #CBD8EA',
                borderRadius: '12px',
                p: { xs: 1.5, sm: 2 },
                boxShadow: '0 2px 8px rgba(30,58,95,0.06)',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 6, height: 6, bgcolor: '#10B981', borderRadius: '50%' }} />
                  <Typography sx={{ fontWeight: 700, color: '#1A2B3C', fontSize: '0.95rem' }}>
                    Live claim scan
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  {displayedClaims.slice(0, 5).map((claim, idx) => (
                    <Box
                      key={idx}
                      className="claim-item"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        bgcolor: getStatusBg(claim.status),
                        borderRadius: '8px',
                        border: `1px solid ${getStatusColor(claim.status)}20`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: getStatusBg(claim.status),
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.6rem',
                            color: getStatusColor(claim.status),
                            border: `1.5px solid ${getStatusColor(claim.status)}`,
                          }}
                        >
                          {claim.init}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: '#1A2B3C', fontSize: '0.78rem' }}>
                            {claim.name}
                          </Typography>
                          <Typography sx={{ color: '#6B7280', fontSize: '0.72rem' }}>
                            {claim.amt}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: getStatusColor(claim.status) }}>
                        <StatusIcon status={claim.status} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* AI Signal Analysis */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                ref={barsRef}
                sx={{ 
                  bgcolor: 'white',
                  border: '1px solid #CBD8EA',
                  borderRadius: '12px',
                  p: { xs: 1.5, sm: 2 },
                  boxShadow: '0 2px 8px rgba(30,58,95,0.06)',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <div style={{ position: 'relative', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1.2px solid transparent', borderTopColor: '#2563EB', borderRightColor: 'rgba(37,99,235,0.2)', animation: 'cometSpin 1.6s linear infinite' }} />
                    <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1.2px solid transparent', borderBottomColor: '#60b8ff', borderLeftColor: 'rgba(96,184,255,0.2)', animation: 'cometSpin 1.6s linear infinite reverse' }} />
                    <svg width="9" height="9" viewBox="0 0 32 32" fill="none">
                      <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="#2563EB" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <Typography sx={{ fontWeight: 700, color: '#1A2B3C', fontSize: '0.95rem' }}>
                    AI Signal Analysis
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {signals.map((signal, idx) => (
                    <Box key={idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#4B5563' }}>
                          {signal.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: signal.color }}>
                          {signal.value}
                        </Typography>
                      </Box>
                      <div
                        style={{
                          height: '4px',
                          background: '#f3f4f6',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            background: signal.color,
                            borderRadius: '3px',
                            width: barsAnimated ? `${signal.value}%` : '0%',
                            transition: barsAnimated
                              ? `width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 0.15}s`
                              : 'none',
                          }}
                        />
                      </div>
                    </Box>
                  ))}
                </Box>
                <Box
                  className="alert-icon"
                  sx={{
                    mt: 1.5,
                    p: 1.2,
                    bgcolor: '#FEE2E2',
                    borderRadius: '8px',
                    border: '1px solid #FECACA',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.8,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <circle cx="12" cy="12" r="10" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
                    <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#991B1B', fontSize: '0.78rem', mb: 0.05 }}>
                      High fraud risk detected
                    </Typography>
                    <Typography sx={{ color: '#DC2626', fontSize: '0.7rem' }}>
                      Flagged for manual review — 3 signals failed
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Metrics */}
          <Box
            sx={{
              mt: 2,
              bgcolor: 'white',
              border: '1px solid #CBD8EA',
              borderRadius: '16px',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: { xs: 0, sm: 0 },
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(30,58,95,0.06)',
            }}
          >
            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, textAlign: 'center', borderRight: { xs: 'none', sm: '1px solid #CBD8EA' }, borderBottom: { xs: '1px solid #CBD8EA', sm: 'none' } }}>
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="#2563EB" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: '#2563EB' }}>
                2.8s
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.35 }}>
                Scan speed
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, color: '#9CA3AF', mt: 0.2 }}>
                Per claim AI analysis
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, textAlign: 'center', borderRight: { xs: 'none', sm: '1px solid #CBD8EA' }, borderBottom: { xs: '1px solid #CBD8EA', sm: 'none' } }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#10B981" stroke="#10B981" strokeWidth="1.5" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: '#10B981' }}>
                0.8%
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.35 }}>
                False positive rate
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, color: '#9CA3AF', mt: 0.2 }}>
                Legit claims wrongly flagged
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 1.2, sm: 1.5 }, textAlign: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: '#F59E0B' }}>
                247
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: 600, color: '#4A6080', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.35 }}>
                Auto-escalated
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, color: '#9CA3AF', mt: 0.2 }}>
                Sent to investigator instantly
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default FraudDetectionSection;