'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const links = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, loading } = useAuth(); // ← loading added
  const [mounted, setMounted] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  useEffect(() => {
    setMounted(true);
  }, []);
  console.log('[MarketingHeader] user:', user, 'loading:', loading);

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: trigger
            ? 'linear-gradient(135deg, rgba(71, 125, 195, 0.95) 0%, rgba(100, 150, 220, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(78, 140, 215, 0.95) 0%, rgba(120, 165, 240, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: trigger 
            ? '0 8px 32px rgba(60, 100, 180, 0.25)' 
            : '0 4px 20px rgba(60, 100, 180, 0.15)',
          transition: 'all 0.3s ease-in-out',
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                <Logo variant="light" />
              </Link>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {links.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

              {/* ← FIXED: !loading wrap added to prevent flash */}
              {mounted && !loading && (
                <>
                  {user ? (
                    <>
                      <Box sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.95rem' }}>
                        👋 {user.full_name}
                      </Box>
                      <Button
                        component={Link}
                        href="/dashboard"
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.95)',
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
                        }}
                      >
                        My Dashboard
                      </Button>
                      <Button
                        onClick={() => logout()}
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.95)',
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        href="/login"
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.95)',
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        component={Link}
                        href="/register"
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          fontWeight: 700,
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          border: '1.5px solid rgba(255, 255, 255, 0.8)',
                          borderRadius: '8px',
                          px: 2,
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            borderColor: '#FFFFFF',
                          },
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </>
              )}

              <Button
                component={Link}
                href="/claim/new"
                variant="contained"
                sx={{
                  fontWeight: 700,
                  borderRadius: '8px',
                  px: { xs: 2.2, md: 3 },
                  py: 1.1,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#2563EB',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    background: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <svg width={16} height={16} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px', display: 'inline-block' }}>
                  <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Nova Strike
              </Button>
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: '#FFFFFF' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 260,
            background: 'linear-gradient(135deg, rgba(71, 125, 195, 0.95) 0%, rgba(100, 150, 220, 0.9) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.25)',
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}>
          <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <Logo variant="light" />
          </Link>
        </Box>
        <List sx={{ px: 1, py: 2 }}>
          {links.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontWeight: 600,
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.95)',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Mobile menu auth buttons */}
          {mounted && !loading && (
            <>
              {user ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary="My Dashboard" slotProps={{ primary: { fontWeight: 600, fontSize: 14, color: '#2D5F9E' } }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => { logout(); setMobileOpen(false); }}>
                      <ListItemText primary="Logout" slotProps={{ primary: { fontWeight: 600, fontSize: 14, color: '#D64045' } }} />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} href="/login" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary="Login" slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} href="/register" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary="Register" slotProps={{ primary: { fontWeight: 600, fontSize: 14, color: '#2D5F9E' } }} />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}