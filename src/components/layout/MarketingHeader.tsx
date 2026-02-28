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

function ElevationScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  return React.cloneElement(children as React.ReactElement<any>, {
    elevation: trigger ? 2 : 0,
    sx: {
      bgcolor: 'rgba(236, 243, 252, 0.94)',
      backdropFilter: trigger ? 'blur(12px)' : 'none',
      color: '#1A2B3C',
      borderBottom: '1px solid #D1DEEF',
      boxShadow: trigger ? '0 2px 12px rgba(30, 58, 95, 0.08)' : '0 1px 0 #CBD8EA',
      transition: 'all 0.3s ease-in-out',
    },
  });
}

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

  useEffect(() => {
    setMounted(true);
  }, []);
  console.log('[MarketingHeader] user:', user, 'loading:', loading);

  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                <Logo variant="dark" />
              </Link>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {links.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{ fontWeight: 600, color: '#4A6080', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
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
                      <Box sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600, color: '#4A6080' }}>
                        👋 {user.full_name}
                      </Box>
                      <Button
                        component={Link}
                        href="/dashboard"
                        sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 600, color: '#2D5F9E' }}
                      >
                        My Dashboard
                      </Button>
                      <Button
                        onClick={() => logout()}
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          fontWeight: 600,
                          color: '#D64045',
                          '&:hover': { bgcolor: 'rgba(214, 64, 69, 0.05)' }
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
                        sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 600, color: '#4A6080' }}
                      >
                        Login
                      </Button>
                      <Button
                        component={Link}
                        href="/register"
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          fontWeight: 700,
                          color: '#2D5F9E',
                          border: '1.5px solid #2D5F9E',
                          borderRadius: '8px',
                          px: 2,
                          '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.05)' }
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
                  borderRadius: '10px',
                  px: { xs: 2.2, md: 3 },
                  py: 1.1,
                  background: 'linear-gradient(135deg, #1E3A5F, #2D5F9E)',
                }}
              >
                ⚡ Nova Strike
              </Button>
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: '#4A6080' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 260, bgcolor: '#EEF4FC', borderRight: '1px solid #CBD8EA' },
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #CBD8EA' }}>
          <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <Logo variant="dark" />
          </Link>
        </Box>
        <List sx={{ px: 1, py: 2 }}>
          {links.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton component={Link} href={item.href} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={item.label} slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
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