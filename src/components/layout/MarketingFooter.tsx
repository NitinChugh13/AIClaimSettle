'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import Logo from '@/components/Logo';

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Compliance', href: '/compliance' },
];

export default function MarketingFooter() {
  return (
    <Box id="contact" sx={{ bgcolor: '#0B1220', color: 'rgba(225,236,255,0.86)', py: { xs: 8, md: 10 }, borderTop: '1px solid rgba(34, 211, 238, 0.18)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 6, md: 8 } }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'white' }}>
                <Logo />
              </Box>
            </Link>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'rgba(210, 223, 246, 0.72)' }}>
              India's leading AI claim engine. Settling thousands of motor claims every month with IRDA-authorised digital inspections.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Quick Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/claim/new" style={{ color: 'rgba(210, 223, 246, 0.82)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width={14} height={14} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Nova Strike
              </Link>
              <Link href="/dashboard" style={{ color: 'rgba(210, 223, 246, 0.82)', textDecoration: 'none', fontSize: '0.9rem' }}>My Dashboard</Link>
              <Link href="/#how-it-works" style={{ color: 'rgba(210, 223, 246, 0.82)', textDecoration: 'none', fontSize: '0.9rem' }}>How It Works</Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Ecosystem Partners</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['SecureShield Insurance', 'PrimeCover General', 'BharatGuard Insurance'].map((p) => (
                <Typography key={p} variant="body2" sx={{ color: 'rgba(210, 223, 246, 0.72)' }}>{p}</Typography>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Support</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.65)' }}>
                <PhoneIcon sx={{ fontSize: 16 }} /> 1800-NOVA-247
              </Typography>
              <Link href="mailto:support@claimnova.in" style={{ color: 'rgba(210, 223, 246, 0.72)', textDecoration: 'none', fontSize: '0.875rem' }}>
                📧 support@claimnova.in
              </Link>
              <Typography variant="caption" sx={{ color: 'rgba(210, 223, 246, 0.42)', mt: 1 }}>Regulatory Ref: IGOV/2024/00421</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(103, 232, 249, 0.18)', mb: { xs: 4, md: 6 } }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Box sx={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(20, 184, 166, 0.55)', mb: 3, boxShadow: '0 0 24px rgba(20, 184, 166, 0.24)' }}>
            <img src="/nitin.png" alt="Nitin Chugh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            Architected by <span style={{ background: 'linear-gradient(90deg, #22D3EE, #2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1.2 }}>NITIN CHUGH</span>
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(210, 223, 246, 0.55)', mt: 1, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
            Full Stack Developer
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2.5, alignItems: 'center', pt: 2, opacity: 0.72 }}>
          <Typography variant="caption" sx={{ color: 'rgba(210, 223, 246, 0.78)' }}>© 2026 ClaimNova. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3.5 } }}>
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} style={{ color: 'rgba(210, 223, 246, 0.78)', textDecoration: 'none', fontSize: '0.75rem' }}>
                {item.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
