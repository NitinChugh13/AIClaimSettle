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
} from '@mui/material';
import {
  Shield as ShieldIcon,
  CameraAlt as CameraIcon,
  Speed as ZapIcon,
  Gavel as GavelIcon,
  Security as LockIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Menu as MenuIcon,
  ArrowForward as ArrowForwardIcon,
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
    title: 'IRDAI Compliant',
    desc: 'Fully compliant with IRDAI guidelines under Section 64UM. Claims below ₹20,000 settled digitally.',
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
  { num: '03', icon: '🤖', title: 'AI Analyses in Seconds', desc: 'Claude AI identifies damaged parts, calculates IRDAI-compliant repair estimates.' },
  { num: '04', icon: '💰', title: 'Get Settlement', desc: 'Download your assessment report. Approved amount transferred directly to your bank.' },
];

const testimonials = [
  { name: 'Rahul Sharma', city: 'Mumbai', vehicle: 'Maruti Swift', amount: '₹12,400', time: '11 minutes', rating: 5, text: 'Could not believe my claim was settled in 11 minutes! The AI was thorough and the amount matched what the garage quoted.' },
  { name: 'Priya Menon', city: 'Bangalore', vehicle: 'Hyundai i20', amount: '₹8,750', time: '8 minutes', rating: 5, text: 'Had an accident on the highway. Filed claim while still at the spot. Settlement was already approved by the time I reached the garage!' },
  { name: 'Vikram Patel', city: 'Delhi', vehicle: 'Honda City', amount: '₹19,200', time: '34 minutes', rating: 4, text: 'Mine went to officer review because the amount was close to ₹20,000. Still settled same day. Much better than waiting 3 weeks!' },
];

function ElevationScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return children
    ? React.cloneElement(children as React.ReactElement<any>, {
      elevation: trigger ? 4 : 0,
      sx: {
        bgcolor: trigger ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: trigger ? 'blur(10px)' : 'none',
        color: trigger ? 'text.primary' : 'white',
        transition: 'all 0.3s ease',
      },
    })
    : children;
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* Navigation */}
      <ElevationScroll>
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
                ClaimSettle AI
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <Button color="inherit" onClick={() => scrollToSection('how-it-works')} sx={{ fontWeight: 600 }}>How It Works</Button>
              <Button color="inherit" onClick={() => scrollToSection('features')} sx={{ fontWeight: 600 }}>Features</Button>
              <Button color="inherit" onClick={() => scrollToSection('testimonials')} sx={{ fontWeight: 600 }}>Testimonials</Button>
              <Button color="inherit" onClick={() => scrollToSection('contact')} sx={{ fontWeight: 600 }}>Contact</Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button component={Link} href="/dashboard" color="inherit" sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 600 }}>
                My Dashboard
              </Button>
              <Button component={Link} href="/claim/new" variant="contained" color="secondary" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>
                File Claim
              </Button>
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Mobile drawer */}
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 240 } }}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">ClaimSettle AI</Typography>
        </Box>
        <List>
          {['how-it-works', 'features', 'testimonials', 'contact'].map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton onClick={() => scrollToSection(item)}>
                <ListItemText primary={item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/dashboard">
              <ListItemText primary="My Dashboard" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Hero Section */}
      <Box sx={{ pt: 20, pb: 12, bgcolor: 'primary.dark', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }} >
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <Chip label="✅ IRDAI Authorised Digital Settlement" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', mb: 3 }} />
                <Typography variant="h2" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.2 }}>
                  Settle Motor Claims <Box component="span" sx={{ color: 'secondary.main', display: 'block' }}>in Under 15 Minutes</Box>
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, fontWeight: 400, maxWidth: 600 }}>
                  No surveyor visit. No paperwork. AI-powered assessment analyses your damage photos and auto-approves eligible claims up to ₹20,000.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                  <Button component={Link} href="/claim/new" variant="contained" color="secondary" size="large" endIcon={<ArrowForwardIcon />} sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}>
                    Start Your Claim
                  </Button>
                  <Button component={Link} href="/claim/track" variant="outlined" size="large" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    Track Existing Claim
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} >
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <Grid container spacing={2}>
                  {[
                    { label: 'Avg. Settlement Time', value: '13 min', icon: '⚡' },
                    { label: 'Claims Auto-Approved', value: '78%', icon: '🤖' },
                    { label: 'Fraud Prevented', value: '₹4.2Cr', icon: '🛡️' },
                    { label: 'Happy Claimants', value: '12,400+', icon: '⭐' },
                  ].map((stat, i) => (
                    <Grid size={{ xs: 6 }} key={stat.label}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.15)' }}>
                        <Typography variant="h4" mb={1}>{stat.icon}</Typography>
                        <Typography variant="h5" fontWeight="bold" color="white">{stat.value}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{stat.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust bar */}
      <Box sx={{ bgcolor: '#0f172a', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, opacity: 0.7 }}>
            {['UIIC Empanelled', 'Oriental Insurance Partner', 'National Insurance Approved', 'ISO 27001 Certified'].map((partner) => (
              <Box key={partner} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                <ShieldIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                <Typography variant="body2" fontWeight="500">{partner}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Box id="how-it-works" sx={{ py: 12, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip label="Simple Process" color="primary" variant="outlined" sx={{ mb: 2, fontWeight: 'bold' }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>How It Works</Typography>
            <Typography variant="h6" color="text.secondary">From accident to settlement in four simple steps.</Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map((step, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.num}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s' } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h2" sx={{ position: 'absolute', top: 16, right: 16, color: 'rgba(0,0,0,0.05)', fontWeight: 900 }}>
                        {step.num}
                      </Typography>
                      <Box sx={{ fontSize: 40, mb: 2 }}>{step.icon}</Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>{step.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box id="features" sx={{ py: 12, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip label="Why ClaimSettle AI" color="primary" variant="outlined" sx={{ mb: 2, fontWeight: 'bold' }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>Built for Indian Insurance</Typography>
            <Typography variant="h6" color="text.secondary">Designed around IRDAI norms and Indian repair market pricing.</Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={f.title}>
                <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <Box sx={{ display: 'flex', gap: 3, p: 4, borderRadius: 4, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(30, 58, 95, 0.02)' } }}>
                    <Box sx={{ flexShrink: 0, width: 56, height: 56, borderRadius: 3, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <f.icon />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>{f.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box id="testimonials" sx={{ py: 12, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip label="Real Stories" color="primary" variant="outlined" sx={{ mb: 2, fontWeight: 'bold' }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>What Claimants Say</Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((t, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(t.rating)].map((_, j) => (
                          <StarIcon key={j} sx={{ color: '#fbbf24', fontSize: 20 }} />
                        ))}
                      </Box>
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 4, flexGrow: 1 }}>
                        "{t.text}"
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">{t.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.city} • {t.vehicle}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">{t.amount}</Typography>
                          <Typography variant="caption" color="text.secondary">in {t.time}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: 12, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>Had an Accident? File Now.</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, mb: 6, fontWeight: 400 }}>
            Don't wait weeks for a surveyor. Get your AI assessment ready in minutes.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button component={Link} href="/claim/new" variant="contained" color="secondary" size="large" sx={{ px: 5, py: 2, fontSize: '1.1rem', borderRadius: 2 }}>
              Start Claim — It's Free
            </Button>
            <Button variant="outlined" size="large" startIcon={<PhoneIcon />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', px: 5, py: 2, fontSize: '1.1rem', borderRadius: 2 }}>
              1800 123 4567
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box id="contact" sx={{ bgcolor: '#0f172a', color: 'rgba(255,255,255,0.6)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'white' }}>
                <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">ClaimSettle AI</Typography>
              </Box>
              <Typography variant="body2">AI-powered instant motor insurance claim settlement. IRDAI authorised.</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} >
              <Typography variant="subtitle2" color="white" fontWeight="bold" mb={2}>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/claim/new" style={{ color: 'inherit', textDecoration: 'none' }}><Typography variant="body2">File a Claim</Typography></Link>
                <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}><Typography variant="body2">My Dashboard</Typography></Link>
                <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => scrollToSection('how-it-works')}>How It Works</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} >
              <Typography variant="subtitle2" color="white" fontWeight="bold" mb={2}>Insurers</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">UIIC</Typography>
                <Typography variant="body2">Oriental Insurance</Typography>
                <Typography variant="body2">National Insurance</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }} >
              <Typography variant="subtitle2" color="white" fontWeight="bold" mb={2}>Support</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">📞 1800 123 4567</Typography>
                <Typography variant="body2">📧 support@claimsettle.ai</Typography>
                <Typography variant="body2">IRDAI Reg: IRDA/NL/xxx</Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid', borderColor: 'secondary.main', mb: 2, boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
              <img src="/nitin.png" alt="Nitin Chugh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Typography variant="body1" color="white" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Developed by <Typography component="span" fontWeight="900" sx={{ color: 'secondary.main', fontSize: '1.1rem', letterSpacing: 1 }}>NITIN CHUGH</Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>Full Stack AI Architect</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
            <Typography variant="caption">© 2026 ClaimSettle AI. All rights reserved.</Typography>
            <Typography variant="caption">Privacy Policy · Terms of Use · Grievance Redressal</Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
