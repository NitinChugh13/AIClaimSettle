'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container, Divider,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  useScrollTrigger,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  CameraAlt as CameraIcon,
  Speed as ZapIcon,
  Gavel as GavelIcon,
  Security as LockIcon,
  Phone as PhoneIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: CameraIcon,
    title: 'Photo-Based Assessment',
    desc: 'Upload damage photos from your phone. Our AI analyses every detail — no surveyor visit required.',
  },
  {
    icon: ZapIcon,
    title: '15-Minute Settlement',
    desc: 'AI processes your claim instantly. Auto-approval for eligible claims. Payment within 2 working days.',
  },
  {
    icon: GavelIcon,
    title: 'IRDA Compliant',
    desc: 'Fully compliant with IRDA guidelines under Section 64UM. Claims below ₹20,000 settled digitally.',
  },
  {
    icon: LockIcon,
    title: 'Bank-Grade Security',
    desc: 'AES-256 encryption, digital signatures on reports, and complete audit trails for every decision.',
  },
];

const steps = [
  { num: '01', icon: '📋', title: 'Verify Your Policy', desc: 'Enter your policy number and vehicle registration. Quick OTP verification.' },
  { num: '02', icon: '📸', title: 'Upload Damage Photos', desc: 'Follow our guided photo upload. Our diagram shows exactly which angle to capture.' },
  { num: '03', icon: '🤖', title: 'AI Analyses in Seconds', desc: 'Claude AI identifies damaged parts, calculates IRDA-compliant repair estimates.' },
  { num: '04', icon: '💰', title: 'Get Settlement', desc: 'Download your assessment report. Approved amount transferred directly to your bank.' },
];

function ElevationScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });
  return children
    ? React.cloneElement(children as React.ReactElement<any>, {
      elevation: trigger ? 2 : 0,
      sx: {
        bgcolor: 'rgba(245, 249, 255, 0.92)',
        backdropFilter: trigger ? 'blur(12px)' : 'none',
        color: '#1A2B3C',
        borderBottom: '1px solid #D1DEEF',
        boxShadow: trigger ? '0 2px 12px rgba(30, 58, 95, 0.08)' : '0 1px 0 #CBD8EA',
        transition: 'all 0.3s ease-in-out',
      },
    })
    : children;
}

import Logo from '@/components/Logo';
import HeroSlideshow from '@/components/HeroSlideshow';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import NovaStrikeSection from '@/components/home/NovaStrikeSection';

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
    { label: 'Compliance', href: '/compliance' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#EDF3FB' }}>

      {/* Navigation */}
      <ElevationScroll>
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                <Logo variant="dark" />
              </Link>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <Button
                color="inherit"
                onClick={() => scrollToSection('how-it-works')}
                sx={{ fontWeight: 600, color: '#4A6080', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                How It Works
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection('features')}
                sx={{ fontWeight: 600, color: '#4A6080', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection('testimonials')}
                sx={{ fontWeight: 600, color: '#4A6080', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                Testimonials
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection('contact')}
                sx={{ fontWeight: 600, color: '#4A6080', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                Contact
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                href="/dashboard"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  fontWeight: 600,
                  color: '#4A6080',
                  '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' }
                }}
              >
                My Dashboard
              </Button>
              <Button
                component={Link}
                href="/claim/new"
                variant="contained"
                sx={{
                  fontWeight: 700,
                  borderRadius: '10px',
                  px: 3,
                  py: 1.25,
                  background: 'linear-gradient(135deg, #1E3A5F, #2D5F9E)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(30, 58, 95, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2D5F9E, #3B82C4)',
                    boxShadow: '0 6px 20px rgba(30, 58, 95, 0.4)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                ⚡ Nova Strike
              </Button>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: '#4A6080' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 260,
            bgcolor: '#F6FAFF',
            borderRight: '1px solid #CBD8EA',
          }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #CBD8EA' }}>
          <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <Logo variant="dark" />
          </Link>
        </Box>
        <List sx={{ px: 1, py: 2 }}>
          {['how-it-works', 'features', 'testimonials', 'contact'].map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                onClick={() => scrollToSection(item)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: '#4A6080',
                  '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.06)', color: '#2D5F9E' }
                }}
              >
                <ListItemText
                  primary={item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/dashboard"
              sx={{ borderRadius: 2, mb: 0.5, color: '#4A6080', '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.06)', color: '#2D5F9E' } }}
            >
              <ListItemText primary="My Dashboard" slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton
              component={Link}
              href="/claim/new"
              sx={{
                borderRadius: 2,
                bgcolor: '#2D5F9E',
                color: 'white',
                '&:hover': { bgcolor: '#1E3A5F' }
              }}
            >
              <ListItemText primary="⚡ Nova Strike" slotProps={{ primary: { fontWeight: 700, fontSize: 14 } }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Hero Section */}
      <HeroSlideshow />

      {/* Trust bar */}
      <Box sx={{ bgcolor: '#EAF1FB', py: 3, borderBottom: '1px solid #CBD8EA', borderTop: '1px solid #CBD8EA' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 6 } }}>
            {['SecureShield Insurance Empanelled', 'PrimeCover General Partner', 'BharatGuard Insurance Approved', 'DataSafe Certified (ISO-27001)'].map((partner) => (
              <Box key={partner} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ShieldIcon sx={{ color: '#2D5F9E', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: 0.5, color: '#4A6080', fontSize: '0.8rem' }}>
                  {partner}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Box id="how-it-works" sx={{ py: 14, bgcolor: '#F7FAFF', borderBottom: '1px solid #CBD8EA' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 9 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Chip
                label="Modern Workflow"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(59, 130, 196, 0.08)',
                  color: '#2D5F9E',
                  borderColor: 'rgba(59, 130, 196, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.05em',
                }}
                variant="outlined"
              />
              <Typography
                variant="h2"
                fontWeight="800"
                sx={{ color: '#1A2B3C', mb: 2, fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif' }}
              >
                Four Steps to Settlement
              </Typography>
              <Typography variant="h6" sx={{ color: '#4A6080', fontWeight: 400 }}>
                Digital-first process designed to eliminate paperwork and delays.
              </Typography>
            </motion.div>
          </Box>

          {/* Desktop Stepper */}
          <Stepper alternativeLabel sx={{
            display: { xs: 'none', md: 'flex' },
            '& .MuiStepConnector-line': { borderColor: '#CBD8EA', borderTopWidth: 2 },
            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': { borderColor: '#2D5F9E' },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': { borderColor: '#0F9D6A' }
          }}>
            {steps.map((step, i) => (
              <Step key={step.num} active={true}>
                <StepLabel icon={
                  <Box sx={{
                    width: 64, height: 64, borderRadius: '50%',
                    bgcolor: 'rgba(45, 95, 158, 0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 30,
                    border: '2px solid #CBD8EA',
                    boxShadow: '0 4px 16px rgba(30, 58, 95, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)', borderColor: '#2D5F9E', boxShadow: '0 8px 24px rgba(30, 58, 95, 0.15)' }
                  }}>
                    {step.icon}
                  </Box>
                }>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#1A2B3C', mt: 2, mb: 1 }}>{step.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#4A6080', px: 2 }}>{step.desc}</Typography>
                  </motion.div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Mobile Vertical Stepper */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2 }}>
            <Stepper orientation="vertical">
              {steps.map((step, i) => (
                <Step key={step.num} active={true}>
                  <StepLabel icon={<Box sx={{ fontSize: 24 }}>{step.icon}</Box>}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1A2B3C' }}>{step.title}</Typography>
                  </StepLabel>
                  <StepContent>
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
                      <Card sx={{ my: 2, bgcolor: '#FDFEFF', border: '1px solid #CBD8EA', boxShadow: '0 2px 8px rgba(30, 58, 95, 0.07)' }}>
                        <CardContent>
                          <Typography variant="body2" sx={{ color: '#4A6080' }}>{step.desc}</Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Container>
      </Box>

      {/* Nova Strike (Phase 2 Focus) */}
      <NovaStrikeSection />

      {/* Features */}
      <Box id="features" sx={{ py: 14, bgcolor: '#F2F7FF', position: 'relative', borderTop: '1px solid #CBD8EA', borderBottom: '1px solid #CBD8EA' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 9 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Chip
                label="Superior Intelligence"
                sx={{
                  mb: 2,
        bgcolor: 'rgba(236, 243, 252, 0.94)',
                  color: '#2D5F9E',
                  borderColor: 'rgba(45, 95, 158, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.05em',
                }}
                variant="outlined"
              />
              <Typography
                variant="h2"
                fontWeight="800"
                sx={{ color: '#1A2B3C', mb: 2, fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif' }}
              >
                Built for Indian Roads
              </Typography>
              <Typography variant="h6" sx={{ color: '#4A6080', maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
                Engineered around IRDA norms and calibrated for the Indian automotive ecosystem.
              </Typography>
            </motion.div>
          </Box>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={f.title}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Box sx={{
                    display: 'flex', gap: 3, p: 4, borderRadius: '16px',
            bgcolor: '#EEF4FC',
                    border: '1px solid #CBD8EA',
                    boxShadow: '0 2px 12px rgba(30, 58, 95, 0.07)',
                    transition: 'all 0.3s ease',
                    position: 'relative', overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                    bgcolor: '#F1F6FD',
                      boxShadow: '0 12px 32px rgba(30, 58, 95, 0.14)',
                      '& .feature-icon-container': { bgcolor: '#2D5F9E', transform: 'scale(1.05)' }
                    }
                  }}>
                    <Box className="feature-icon-container" sx={{
                      flexShrink: 0, width: 56, height: 56, borderRadius: '12px',
                      bgcolor: 'rgba(45, 95, 158, 0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}>
                      <f.icon sx={{ fontSize: 28, color: '#2D5F9E', '.feature-icon-container:hover &': { color: '#fff' } }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: '#1A2B3C', mb: 1, fontSize: '1.1rem' }}>{f.title}</Typography>
                      <Typography variant="body1" sx={{ color: '#4A6080', lineHeight: 1.7, fontSize: '0.9rem' }}>{f.desc}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box
        id="testimonials"
        sx={{
          py: { xs: 10, md: 14 },
          background: 'radial-gradient(circle at top, #15243D 0%, #0B1220 65%, #0A0F1E 100%)',
          borderTop: '1px solid rgba(59, 130, 246, 0.22)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 9 }}>
            <Chip
              label="Wall of Proof"
              sx={{
                mb: 2,
                bgcolor: 'rgba(34, 211, 238, 0.1)',
                color: '#67E8F9',
                borderColor: 'rgba(34, 211, 238, 0.35)',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
              }}
              variant="outlined"
            />
            <Typography
              variant="h2"
              fontWeight="800"
              sx={{ color: '#E6F0FF', mb: 2, fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif', fontSize: { xs: '2rem', md: '3.25rem' } }}
            >
              Trusted by Thousands
            </Typography>
            <Typography sx={{ color: 'rgba(214, 228, 252, 0.75)', maxWidth: 650, mx: 'auto' }}>
              Real settlements. Real policyholders. Built with the consistency and trust standards of a premium insurance platform.
            </Typography>
          </Box>
          <TestimonialCarousel />
        </Container>
      </Box>

      {/* CTA — Intentional dark brand section */}
      <Box sx={{
        py: { xs: 9, md: 14 },
        px: 2,
        background: 'linear-gradient(135deg, #0F172A 0%, #16243B 50%, #1E3A5F 100%)',
        color: 'white',
        textAlign: 'center',
        borderTop: '1px solid rgba(34, 211, 238, 0.25)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="800"
            gutterBottom
            sx={{
              fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.25rem' },
              lineHeight: { xs: 1.22, md: 1.15 },
              color: '#F8FBFF',
              textShadow: '0 2px 18px rgba(2, 6, 23, 0.55)',
            }}
          >
            Don't Wait for a Surveyor. <br />
            <span style={{ color: '#67E8F9' }}>Launch Nova Strike Today.</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(225, 236, 255, 0.8)', mb: { xs: 4, md: 6 }, fontWeight: 400, maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.2rem' } }}>
            Get your AI assessment ready in under 15 minutes. Secure, IRDA-compliant, and lightning fast.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.25, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/claim/new"
              variant="contained"
              size="large"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: 380, sm: 'none' },
                px: { xs: 3.5, md: 6 }, py: 1.75, fontSize: { xs: '0.98rem', md: '1.05rem' }, fontWeight: 700, borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                boxShadow: '0 10px 28px rgba(20, 184, 166, 0.28)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1D4ED8, #0EA5A4)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(20, 184, 166, 0.35)',
                }
              }}
            >
              Launch Nova Strike
            </Button>
            <Button
              component="a"
              href="tel:18006682247"
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: 380, sm: 'none' },
                color: 'white',
                borderColor: 'rgba(103, 232, 249, 0.45)',
                px: { xs: 3.5, md: 6 }, py: 1.75, fontSize: { xs: '0.98rem', md: '1.05rem' }, borderRadius: '12px',
                '&:hover': { borderColor: '#67E8F9', bgcolor: 'rgba(20, 184, 166, 0.08)' }
              }}
            >
              Call 1800-NOVA-247
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer — Intentional dark brand */}
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
                <Link
                  href="/claim/new"
                  style={{ color: 'rgba(210, 223, 246, 0.82)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#67E8F9'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(210, 223, 246, 0.82)'}
                >
                  ⚡ Nova Strike
                </Link>
                <Link
                  href="/dashboard"
                  style={{ color: 'rgba(210, 223, 246, 0.82)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#67E8F9'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(210, 223, 246, 0.82)'}
                >
                  My Dashboard
                </Link>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', color: 'rgba(210, 223, 246, 0.82)', transition: 'color 0.2s', '&:hover': { color: '#67E8F9' } }}
                  onClick={() => scrollToSection('how-it-works')}
                >
                  How It Works
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Ecosystem Partners</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['SecureShield Insurance', 'PrimeCover General', 'BharatGuard Insurance'].map(p => (
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
            <Box sx={{
              width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
              border: '3px solid rgba(20, 184, 166, 0.55)', mb: 3,
              boxShadow: '0 0 24px rgba(20, 184, 166, 0.24)',
            }}>
              <img src="/nitin.png" alt="Nitin Chugh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}>
              Architected by{' '}
              <Typography
                component="span"
                fontWeight="900"
                sx={{
                  background: 'linear-gradient(90deg, #22D3EE, #2DD4BF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.3rem',
                  letterSpacing: 1.5,
                }}
              >
                NITIN CHUGH
              </Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(210, 223, 246, 0.55)', mt: 1, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
              Full Stack Developer
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2.5, alignItems: 'center', pt: 2, opacity: 0.72 }}>
            <Typography variant="caption" sx={{ color: 'rgba(210, 223, 246, 0.78)' }}>© 2026 ClaimNova. All rights reserved.</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: { xs: 2, sm: 3.5 } }}>
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    color: 'rgba(210, 223, 246, 0.78)',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#67E8F9'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(210, 223, 246, 0.78)'}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
