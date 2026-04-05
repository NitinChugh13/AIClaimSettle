'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Typography,
  Button,
  Container, Divider,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  AppBar,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  CameraAlt as CameraIcon,
  Speed as ZapIcon,
  Gavel as GavelIcon,
  Security,
  Phone as PhoneIcon,
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Public as PublicIcon,
  Lock as LockIcon,
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

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Mumbai • Maruti Swift',
    rating: 5,
    quote: 'Settled in 11 minutes flat. Uploaded photos from my phone and the AI knew exactly which parts were damaged. No surveyor came to my house.',
    amount: '₹12,400',
    time: '11 min',
    initials: 'RK',
    color: '#2D5F9E'
  },
  {
    name: 'Priya Sharma',
    location: 'Bangalore • Honda City',
    rating: 5,
    quote: 'I was skeptical about AI claims but this was genuinely faster than anything I have experienced. My dealer was shocked.',
    amount: '₹8,750',
    time: '9 min',
    initials: 'PS',
    color: '#0284C7'
  },
  {
    name: 'Vikram Patel',
    location: 'Delhi • Honda City',
    rating: 4,
    quote: 'Mine went to officer review because the amount was close to ₹20,000. Still settled same day. Much better than waiting 3 weeks!',
    amount: '₹19,200',
    time: '34 min',
    initials: 'VP',
    color: '#7C3AED'
  },
  {
    name: 'Anita Desai',
    location: 'Chennai • Hyundai i20',
    rating: 5,
    quote: 'The photo guide was very helpful. It told me exact angles to capture. Report was ready before I even got home.',
    amount: '₹6,200',
    time: '8 min',
    initials: 'AD',
    color: '#059669'
  },
  {
    name: 'Suresh Nair',
    location: 'Hyderabad • Tata Nexon',
    rating: 5,
    quote: 'Three door dents after a parking lot incident. AI identified all three separately with individual cost estimates. Impressive.',
    amount: '₹15,800',
    time: '13 min',
    initials: 'SN',
    color: '#DC2626'
  },
  {
    name: 'Meera Joshi',
    location: 'Pune • Kia Seltos',
    rating: 5,
    quote: 'As a single woman I was worried about dealing with insurance. This app made it completely stress free. Highly recommend.',
    amount: '₹9,100',
    time: '7 min',
    initials: 'MJ',
    color: '#D97706'
  },
  {
    name: 'Arjun Singh',
    location: 'Jaipur • Fortuner',
    rating: 5,
    quote: 'Big SUV repair estimate done accurately. The AI even caught damage I had missed on the rear bumper corner.',
    amount: '₹28,500',
    time: '15 min',
    initials: 'AS',
    color: '#0F766E'
  },
  {
    name: 'Kavya Reddy',
    location: 'Hyderabad • Baleno',
    rating: 5,
    quote: 'Used this after a minor accident near my office. Was back at my desk within 20 minutes of submitting. Amazing.',
    amount: '₹4,800',
    time: '6 min',
    initials: 'KR',
    color: '#BE185D'
  },
  {
    name: 'Amit Verma',
    location: 'Noida • Creta',
    rating: 4,
    quote: 'Solid product. Some questions during verification but overall smooth. Transfer came in exactly 2 days as promised.',
    amount: '₹11,300',
    time: '18 min',
    initials: 'AV',
    color: '#1D4ED8'
  },
];

const TestimonialCardComponent = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Box sx={{
    bgcolor: 'white',
    border: '1px solid #CBD8EA',
    borderRadius: { xs: '12px', sm: '16px' },
    p: { xs: 2, sm: 2.5, md: 3 },
    boxShadow: '0 2px 12px rgba(30,58,95,0.06)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }}>
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      gap: { xs: 0.75, sm: 1.5 },
      mb: 2,
      minWidth: 0,
    }}>
      <Box sx={{
        width: { xs: 32, sm: 40, md: 44 },
        height: { xs: 32, sm: 40, md: 44 },
        borderRadius: '50%',
        bgcolor: testimonial.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: { xs: '12px', sm: '14px' },
        flexShrink: 0,
      }}>
        {testimonial.initials}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{
          color: '#1A2B3C',
          fontWeight: 600,
          fontSize: { xs: '13px', sm: '14px', md: '15px' },
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}>
          {testimonial.name}
        </Typography>
        <Typography sx={{
          color: '#4A6080',
          fontSize: { xs: '11px', sm: '12px', md: '13px' },
          wordBreak: 'break-word',
        }}>
          {testimonial.location}
        </Typography>
      </Box>
      <Box sx={{
        textAlign: { xs: 'left', sm: 'right' },
        flexShrink: 0,
        alignSelf: { xs: 'flex-start', sm: 'center' },
        whiteSpace: 'nowrap',
      }}>
        <Typography sx={{
          color: '#2D5F9E',
          fontWeight: 700,
          fontSize: { xs: '12px', sm: '13px', md: '14px' },
        }}>
          {testimonial.amount}
        </Typography>
        <Typography sx={{
          color: '#4A6080',
          fontSize: { xs: '10px', sm: '11px', md: '12px' },
        }}>
          in {testimonial.time}
        </Typography>
      </Box>
    </Box>
    <Box sx={{
      mb: 1.5,
      color: '#F59E0B',
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    }}>
      {'★'.repeat(testimonial.rating)}{'☆'.repeat(5-testimonial.rating)}
    </Box>
    <Typography sx={{
      color: '#4A6080',
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
      lineHeight: 1.5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      flex: 1,
    }}>
      "{testimonial.quote}"
    </Typography>
  </Box>
);

import Logo from '@/components/Logo';
import HeroSection from '@/components/HeroSection';
import FraudDetectionSection from '@/components/FraudDetectionSection';
// Testimonial Carousel removed - using inline masonry component instead
import ClaimNovaLoader from '@/components/ClaimNovaLoader';
import { useAuth } from '@/context/AuthContext';

interface ElevationScrollProps {
  children: React.ReactElement;
}

// function ElevationScroll(props: ElevationScrollProps) {
//   const { children } = props;
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 50,
//   });

//   return React.cloneElement(children, {
//     elevation: 0,
//     sx: {
//       background: trigger 
//         ? 'rgba(237, 243, 251, 0.85) !important'
//         : 'transparent !important',
//       backgroundColor: 'transparent !important',
//       backdropFilter: trigger ? 'blur(16px)' : 'none',
//       WebkitBackdropFilter: trigger ? 'blur(16px)' : 'none',
//       boxShadow: trigger 
//         ? '0 2px 20px rgba(100, 130, 200, 0.12) !important' 
//         : 'none !important',
//       borderBottom: trigger 
//         ? '1px solid rgba(200, 220, 245, 0.4)' 
//         : 'none',
//       transition: 'all 0.3s ease',
//     }
//   } as any);
// }

// Auto-play animation component
function AutoPlayHowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationState, setAnimationState] = useState<{
    policyNumber: string;
    vehicleNumber: string;
    policyVerified: boolean;
    otpBoxes: boolean[];
    otpVerified: boolean;
    photos: string[];
    photoCount: number;
    processingPercent: number;
    processingTasks: boolean[];
    settlementAmount: number;
    settlementRowsVisible: boolean[];
  }>({
    policyNumber: '',
    vehicleNumber: '',
    policyVerified: false,
    otpBoxes: [false, false, false, false, false, false],
    otpVerified: false,
    photos: Array(8).fill('empty'),
    photoCount: 0,
    processingPercent: 0,
    processingTasks: [false, false, false, false],
    settlementAmount: 0,
    settlementRowsVisible: [false, false, false, false],
  });

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play sequence
  useEffect(() => {
    if (!isVisible) return;

    const runSequence = async () => {
      // STEP 1: Policy Verification (0-3s)
      setCurrentStep(0);
      setAnimationState(prev => ({
        ...prev,
        policyNumber: '',
        vehicleNumber: '',
        policyVerified: false,
      }));

      // Type policy number
      for (let i = 0; i <= 12; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setAnimationState(prev => ({
          ...prev,
          policyNumber: 'POL-2024-98471'.substring(0, i),
        }));
      }

      // Type vehicle number
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setAnimationState(prev => ({
          ...prev,
          vehicleNumber: 'DL01AB1234'.substring(0, i),
        }));
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      setAnimationState(prev => ({...prev, policyVerified: true}));

      // STEP 2: OTP (3-6s)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(1);
      setAnimationState(prev => ({
        ...prev,
        otpBoxes: [false, false, false, false, false, false],
        otpVerified: false,
      }));

      // Fill OTP boxes
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setAnimationState(prev => {
          const newBoxes = [...prev.otpBoxes];
          newBoxes[i] = true;
          return {...prev, otpBoxes: newBoxes};
        });
      }

      await new Promise(resolve => setTimeout(resolve, 400));
      setAnimationState(prev => ({...prev, otpVerified: true}));

      // STEP 3: Photos (6-10s)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(2);
      setAnimationState(prev => ({
        ...prev,
        photos: Array(8).fill('empty'),
        photoCount: 0,
      }));

      // Fill photo slots
      for (let i = 0; i < 8; i++) {
        setAnimationState(prev => {
          const newPhotos = [...prev.photos];
          newPhotos[i] = 'uploading';
          return {...prev, photos: newPhotos};
        });
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnimationState(prev => {
          const newPhotos = [...prev.photos];
          newPhotos[i] = 'done';
          return {...prev, photos: newPhotos, photoCount: i + 1};
        });
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // STEP 4: AI Processing (10-14s)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(3);
      setAnimationState(prev => ({
        ...prev,
        processingPercent: 0,
        processingTasks: [false, false, false, false],
      }));

      // Count percentage
      for (let p = 0; p <= 100; p += 5) {
        await new Promise(resolve => setTimeout(resolve, 120));
        setAnimationState(prev => ({...prev, processingPercent: p}));
      }

      // Show tasks
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnimationState(prev => {
          const newTasks = [...prev.processingTasks];
          newTasks[i] = true;
          return {...prev, processingTasks: newTasks};
        });
      }

      // STEP 5: Settlement (14-18s)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(4);
      setAnimationState(prev => ({
        ...prev,
        settlementAmount: 0,
        settlementRowsVisible: [false, false, false, false],
      }));

      // Count up amount
      for (let a = 0; a <= 18450; a += 100) {
        await new Promise(resolve => setTimeout(resolve, 20));
        setAnimationState(prev => ({...prev, settlementAmount: Math.min(a, 18450)}));
      }

      // Fade in rows
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 700));
        setAnimationState(prev => {
          const newRows = [...prev.settlementRowsVisible];
          newRows[i] = true;
          return {...prev, settlementRowsVisible: newRows};
        });
      }

      // Wait 5s on Step 5, then loop
      await new Promise(resolve => setTimeout(resolve, 5000));
      runSequence();
    };

    runSequence();
  }, [isVisible]);

  const stepIndicators = [
    { label: 'Policy Verify', index: 0 },
    { label: 'OTP', index: 1 },
    { label: 'Photo Upload', index: 2 },
    { label: 'AI Settlement', index: 3 },
  ];

  const stepDots = [
    { label: 'Policy', index: 0 },
    { label: 'OTP', index: 1 },
    { label: 'Photos', index: 2 },
    { label: 'AI', index: 3 },
    { label: 'Result', index: 4 },
  ];

  return (
    <Box ref={sectionRef} sx={{ position: 'relative' }}>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateMid {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes rotateFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes aiPulse1 {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes aiDot {
          0%, 100% { opacity: 0; transform: rotate(var(--r,0deg)) translateX(42px) translateY(-50%) scale(0.5); }
          50% { opacity: 1; transform: rotate(var(--r,0deg)) translateX(42px) translateY(-50%) scale(1); }
        }
        .step-enter {
          animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .step-exit {
          animation: slideOutLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pulse-badge {
          animation: pulse 2s infinite;
        }
        .spin-outer {
          animation: spin 3s linear infinite;
        }
        .spin-mid {
          animation: rotateMid 2s linear infinite;
        }
        .spin-fast {
          animation: rotateFast 1s linear infinite;
        }
      `}</style>

      {/* Step Counter Dots */}
      <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 0.5, sm: 0.8, md: 0.8 }, flexWrap: 'wrap' }}>
        {stepDots.map((dot, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 0.3, md: 0.5 } }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: { xs: 20, sm: 26 },
                  height: { xs: 20, sm: 26 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: '8px', sm: '10px' },
                  fontWeight: 700,
                  border: currentStep === i ? '2px solid #2D5F9E' : currentStep > i ? 'none' : '2px solid #CBD8EA',
                  bgcolor: currentStep > i ? '#2D5F9E' : currentStep === i ? 'white' : '#F7FAFF',
                  color: currentStep > i ? 'white' : currentStep === i ? '#2D5F9E' : '#CBD8EA',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {currentStep > i ? '✓' : i + 1}
              </Box>
              {currentStep === i && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    border: '2px solid #2D5F9E',
                    opacity: 0.3,
                    animation: 'pulse 2s infinite',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </Box>
            <Typography sx={{ fontSize: { xs: '7px', sm: '9px' }, color: '#4A6080', fontWeight: 500, textAlign: 'center', width: { xs: 28, sm: 38 } }}>
              {dot.label}
            </Typography>
            {i < stepDots.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 'calc(50% + 30px)',
                  width: 'calc(100% / 5 - 60px)',
                  maxWidth: 40,
                  height: '2px',
                  bgcolor: currentStep > i ? '#2D5F9E' : '#CBD8EA',
                  transition: 'all 0.3s ease',
                  zIndex: 1,
                  mt: '-22px',
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Main Layout: 2 Columns */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '35% 65%' }, gap: 3, alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: Step Indicators */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1 }}>
          {stepIndicators.map((step) => (
            <Box
              key={step.index}
              sx={{
                p: 1.5,
                borderLeft: currentStep === step.index ? '4px solid #2D5F9E' : currentStep > step.index ? '4px solid #0F9D6A' : '4px solid #CBD8EA',
                bgcolor: currentStep === step.index ? '#EDF3FB' : currentStep > step.index ? '#F0FDF4' : '#F7FAFF',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  fontSize: '14px',
                  color: currentStep === step.index ? '#2D5F9E' : currentStep > step.index ? '#0F9D6A' : '#CBD8EA',
                }}>
                  {currentStep > step.index ? '✓' : '●'}
                </Box>
                <Typography sx={{
                  fontWeight: currentStep === step.index ? 700 : 600,
                  color: currentStep === step.index ? '#2D5F9E' : currentStep > step.index ? '#0F9D6A' : '#4A6080',
                  textDecoration: currentStep > step.index ? 'line-through' : 'none',
                  fontSize: '13px',
                }}>
                  {step.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* RIGHT COLUMN: Animated Card */}
        <Box sx={{ position: 'relative', minHeight: 280, display: 'flex', alignItems: 'center' }}>
          
          {/* STEP 1: Policy Verification */}
          {currentStep === 0 && (
            <Box className="step-enter" sx={{ width: '100%', minHeight: 260 }}>
              <Card sx={{
                bgcolor: 'white',
                border: '1px solid #CBD8EA',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(30,58,95,0.08)',
                p: 0,
                minHeight: 260,
                overflow: 'hidden',
              }}>
                {/* Gradient Header */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F9E 50%, #4A90D9 100%)',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="2" width="16" height="20" rx="2" stroke="white" strokeWidth="1.5"/>
                      <path d="M8 7h8M8 11h8M8 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                    Verify Your Policy
                  </Typography>
                  <Box sx={{ ml: 'auto', px: 1.5, py: 0.3, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '99px', fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Step 1/5
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#4A6080', fontWeight: 600, fontSize: '12px' }}>Policy Number</Typography>
                  <Box sx={{
                    p: 1.5,
                    border: '1px solid #CBD8EA',
                    borderLeft: '3px solid #2D5F9E',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#1A2B3C',
                    bgcolor: '#F0F7FF',
                    minHeight: 36,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {animationState.policyNumber}<span style={{ marginLeft: '2px' }}>|</span>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#4A6080', fontWeight: 600, fontSize: '12px' }}>Vehicle Registration</Typography>
                  <Box sx={{
                    p: 1.5,
                    border: '1px solid #CBD8EA',
                    borderLeft: '3px solid #2D5F9E',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#1A2B3C',
                    bgcolor: '#F0F7FF',
                    minHeight: 36,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {animationState.vehicleNumber}<span style={{ marginLeft: '2px' }}>|</span>
                  </Box>
                </Box>

                {animationState.policyVerified && (
                  <Box sx={{
                    p: 2,
                    bgcolor: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    animation: 'slideInRight 0.3s ease',
                  }}>
                    <Box sx={{ color: '#16A34A', fontSize: '18px', fontWeight: 700 }}>✓</Box>
                    <Typography sx={{ color: '#16A34A', fontWeight: 600, fontSize: '14px' }}>
                      Policy found — Active coverage
                    </Typography>
                  </Box>
                )}
                </Box>
              </Card>
            </Box>
          )}

          {/* STEP 2: OTP */}
          {currentStep === 1 && (
            <Box className="step-enter" sx={{ width: '100%' }}>
              <Card sx={{
                bgcolor: 'white',
                border: '1px solid #CBD8EA',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(30,58,95,0.08)',
                p: 0,
                overflow: 'hidden',
              }}>
                {/* Gradient Header */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F9E 50%, #4A90D9 100%)',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="2" width="14" height="20" rx="3" stroke="white" strokeWidth="1.5"/>
                      <circle cx="12" cy="17" r="1.5" fill="white"/>
                      <path d="M9 6h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                    Verify OTP
                  </Typography>
                  <Box sx={{ ml: 'auto', px: 1.5, py: 0.3, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '99px', fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Step 2/5
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ mb: 2, color: '#4A6080', fontSize: '11px' }}>
                  Sent to ••••7823
                </Typography>
                
                <Box sx={{ mb: 2, display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                  {animationState.otpBoxes.map((filled, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 36,
                        height: 40,
                        border: filled ? 'none' : '2px solid #CBD8EA',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        bgcolor: filled ? '#2D5F9E' : '#F7FAFF',
                        fontWeight: 600,
                        color: filled ? 'white' : 'transparent',
                        boxShadow: filled ? '0 2px 8px rgba(45,95,158,0.3)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {filled ? '●' : ''}
                    </Box>
                  ))}
                </Box>

                {animationState.otpVerified && (
                  <Box sx={{
                    p: 1.5,
                    bgcolor: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: '6px',
                    textAlign: 'center',
                    animation: 'slideInRight 0.3s ease',
                  }}>
                    <Typography sx={{ color: '#16A34A', fontWeight: 600, fontSize: '12px' }}>
                      ✓ Code verified successfully
                    </Typography>
                  </Box>
                )}
                </Box>
              </Card>
            </Box>
          )}

          {/* STEP 3: Photos */}
          {currentStep === 2 && (
            <Box className="step-enter" sx={{ width: '100%', minHeight: 260 }}>
              <Card sx={{
                bgcolor: 'white',
                border: '1px solid #CBD8EA',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(30,58,95,0.08)',
                p: 0,
                minHeight: 260,
                overflow: 'hidden',
              }}>
                {/* Gradient Header */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F9E 50%, #4A90D9 100%)',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  justifyContent: 'space-between',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="6" width="20" height="15" rx="2" stroke="white" strokeWidth="1.5"/>
                        <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.5"/>
                        <path d="M8 6l1.5-2h5L16 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="18" cy="10" r="1" fill="white"/>
                      </svg>
                    </Box>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                      Upload Damage Photos
                    </Typography>
                  </Box>
                  <Box sx={{
                    px: 1.5,
                    py: 0.3,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    {animationState.photoCount}/8
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>

                <Box sx={{ bgcolor: '#F8FAFF', p: { xs: 0.75, sm: 1 }, borderRadius: 2, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 0.4, sm: 0.6 } }}>
                  {animationState.photos.map((status, i) => {
                    const photoZone = [
                      { 
                        label: 'Front', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg'
                      },
                      { 
                        label: 'Rear', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_rear_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_rear_8.15.19.jpg'
                      },
                      { 
                        label: 'Left', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_left_side_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_left_side_8.15.19.jpg'
                      },
                      { 
                        label: 'Right', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg'
                      },
                      { 
                        label: 'Hood', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_left_side_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_left_side_8.15.19.jpg'
                      },
                      { 
                        label: 'Dashboard', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_rear_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_rear_8.15.19.jpg'
                      },
                      { 
                        label: 'Windshield', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg'
                      },
                      { 
                        label: 'Tyre', 
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_rear_8.15.19.jpg/320px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_rear_8.15.19.jpg'
                      },
                    ][i];
                    return (
                      <Box key={i}>
                        <Box
                          sx={{
                            aspectRatio: '1/1',
                            border: status === 'empty' ? '2px dashed #CBD8EA' : '2px solid #2D5F9E',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: status === 'empty' ? '#F7FAFF' : '#EDF3FB',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            minWidth: 0,
                          }}
                        >
                          {status === 'empty' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="10" r="3" stroke="#CBD8EA" strokeWidth="1.5"/>
                              <path d="M2 8h4l2-2h8l2 2h4v10H2z" stroke="#CBD8EA" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          ) : (
                            <>
                              <img
                                src={photoZone.url}
                                alt={photoZone.label}
                                loading="eager"
                                decoding="async"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    e.currentTarget.style.display = 'none';
                                    parent.style.background = 'linear-gradient(135deg, #DBEAFE, #EFF6FF)';
                                  }
                                }}
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  zIndex: 1,
                                }}
                              />
                              {status === 'uploading' && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    background: 'linear-gradient(90deg, transparent, #3B82C4, transparent)',
                                    top: '-2px',
                                    animation: 'scanLine 0.8s linear infinite',
                                    zIndex: 3,
                                  }}
                                />
                              )}
                              {status === 'done' && (
                                <>
                                  <Box sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: 'rgba(45, 95, 158, 0.15)',
                                    zIndex: 2,
                                  }} />
                                  <Box sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    width: 24,
                                    height: 24,
                                    bgcolor: '#16A34A',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    color: 'white',
                                    fontWeight: 700,
                                    zIndex: 3,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                  }}>
                                    ✓
                                  </Box>
                                </>
                              )}
                            </>
                          )}
                        </Box>
                        <Typography sx={{
                          fontSize: '7px',
                          color: '#4A6080',
                          fontWeight: 500,
                          textAlign: 'center',
                          mt: 0.3,
                        }}>
                          {photoZone.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                </Box>
              </Card>
            </Box>
          )}

          {/* STEP 4: AI Processing */}
          {currentStep === 3 && (
            <Box className="step-enter" sx={{ width: '100%', minHeight: 260 }}>
              <Card sx={{
                bgcolor: 'white',
                border: '1px solid #CBD8EA',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(30,58,95,0.08)',
                p: 0,
                minHeight: 260,
                overflow: 'hidden',
              }}>
                {/* Gradient Header */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F9E 50%, #4A90D9 100%)',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                    AI Processing
                  </Typography>
                  <Box sx={{ ml: 'auto', px: 1.5, py: 0.3, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '99px', fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Step 4/5
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
                  {/* New Neural Network Scanning Animation */}
                  <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto' }}>
                    {/* Outer pulsing ring */}
                    <Box sx={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      border: '2px solid rgba(45,95,158,0.2)',
                      animation: 'aiPulse1 2s ease-in-out infinite',
                    }}/>
                    {/* Middle scanning ring */}
                    <Box sx={{
                      position: 'absolute', inset: 10, borderRadius: '50%',
                      border: '2px solid transparent',
                      borderTopColor: '#2D5F9E',
                      borderRightColor: '#2D5F9E',
                      animation: 'spin 1.2s linear infinite',
                    }}/>
                    {/* Inner reverse ring */}
                    <Box sx={{
                      position: 'absolute', inset: 22, borderRadius: '50%',
                      border: '2px solid transparent',
                      borderBottomColor: '#0284C7',
                      borderLeftColor: '#0284C7',
                      animation: 'spinReverse 0.8s linear infinite',
                    }}/>
                    {/* Center circle with percentage */}
                    <Box sx={{
                      position: 'absolute', inset: 34, borderRadius: '50%',
                      bgcolor: '#EDF3FB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexDirection: 'column',
                    }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#2D5F9E', lineHeight: 1 }}>
                        {animationState.processingPercent}%
                      </Typography>
                    </Box>
                    {/* Scanning dots around ring */}
                    {[0,1,2,3].map(i => (
                      <Box key={i} sx={{
                        position: 'absolute',
                        width: 6, height: 6,
                        borderRadius: '50%',
                        bgcolor: '#2D5F9E',
                        top: '50%', left: '50%',
                        transform: `rotate(${i*90}deg) translateX(42px) translateY(-50%)`,
                        animation: `aiDot 2s ease-in-out ${i*0.5}s infinite`,
                        opacity: 0,
                      }}/>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Extract vehicle', 'Analyze damage', 'Calculate estimate', 'Generate report'].map((task, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 1.5,
                        py: 1,
                        bgcolor: animationState.processingTasks[i] ? '#F0FDF4' : '#F7FAFF',
                        border: `1px solid ${animationState.processingTasks[i] ? '#86EFAC' : '#CBD8EA'}`,
                        borderLeft: animationState.processingTasks[i] ? '3px solid #16A34A' : '1px solid #CBD8EA',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'all 0.3s ease',
                        animation: animationState.processingTasks[i] ? 'slideInRight 0.3s ease' : 'none',
                      }}
                    >
                      <Box sx={{
                        fontSize: '12px',
                        color: animationState.processingTasks[i] ? '#16A34A' : '#CBD8EA',
                        fontWeight: 700,
                      }}>
                        {animationState.processingTasks[i] ? '✓' : '○'}
                      </Box>
                      <Typography sx={{
                        color: animationState.processingTasks[i] ? '#16A34A' : '#4A6080',
                        fontWeight: animationState.processingTasks[i] ? 600 : 500,
                        fontSize: '11px',
                        textDecoration: 'none',
                      }}>
                        {task}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                </Box>
              </Card>
            </Box>
          )}

          {/* STEP 5: Settlement Result */}
          {currentStep === 4 && (
            <Box className="step-enter" sx={{ width: '100%' }}>
              <Card sx={{
                bgcolor: 'white',
                border: '1px solid #CBD8EA',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(30,58,95,0.08)',
                overflow: 'hidden',
                minHeight: 260,
              }}>
                {/* Top Section - Dark Gradient */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #1E3A5F, #2D5F9E)',
                  p: 2,
                  position: 'relative',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
                          <path d="M2 10h20" stroke="white" strokeWidth="1.5"/>
                          <path d="M6 15h4M14 15h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </Box>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                        Claim Approved!
                      </Typography>
                    </Box>
                    <Box
                      className="pulse-badge"
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        bgcolor: '#FEF08A',
                        border: 'none',
                        borderRadius: '20px',
                        color: '#7C2D12',
                        fontWeight: 600,
                        fontSize: '10px',
                      }}
                    >
                      Auto-Approved
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', mb: 0.4 }}>Settlement Amount</Typography>
                    <Typography sx={{ color: 'white', fontSize: '22px', fontWeight: 800, mb: 0.8 }}>
                      ₹{animationState.settlementAmount.toLocaleString()}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px' }}>
                      Claim ID: CLM-2024-78945
                    </Typography>
                  </Box>
                </Box>

                {/* Bottom Section - Details */}
                <Box sx={{ p: 2, bgcolor: 'white' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {[
                      { label: 'Repair Cost', value: '₹15,200' },
                      { label: 'Labor Charges', value: '₹2,100' },
                      { label: 'Parts Cost', value: '₹1,150' },
                      { label: 'Approved by', value: 'AI System' },
                    ].map((row, i) => (
                      animationState.settlementRowsVisible[i] && (
                        <Box
                          key={i}
                          sx={{
                            p: 0.8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: i % 2 === 0 ? '#F0F7FF' : 'white',
                            borderRadius: '6px',
                            border: '1px solid #CBD8EA',
                            borderLeft: '3px solid #2D5F9E',
                            animation: 'slideInRight 0.3s ease',
                          }}
                        >
                          <Typography sx={{ color: '#4A6080', fontWeight: 500, fontSize: '10px' }}>{row.label}</Typography>
                          <Typography sx={{ color: '#2D5F9E', fontWeight: 700, fontSize: '10px' }}>{row.value}</Typography>
                        </Box>
                      )
                    ))}
                  </Box>

                  <Box sx={{
                    p: 1,
                    bgcolor: '#E0E7FF',
                    borderRadius: '6px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.75,
                  }}>
                    <Box sx={{ fontSize: '12px' }}>🕐</Box>
                    <Typography sx={{ color: '#2D5F9E', fontWeight: 600, fontSize: '10px' }}>
                      Transfer in 2 working days
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const { user, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <ClaimNovaLoader />

      {/* Navigation */}
      
       {/* ElevationScroll wrapper HATAO, seedha AppBar likho */}
<AppBar
  position="fixed"
  elevation={0}
  color="transparent"
  sx={{
    background: scrolled
      ? 'rgba(237, 243, 251, 0.72) !important'
      : 'transparent !important',
    backdropFilter: scrolled ? 'blur(24px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
    boxShadow: scrolled
      ? '0 2px 20px rgba(100, 130, 200, 0.12) !important'
      : 'none !important',
    borderBottom: scrolled
      ? '1px solid rgba(200, 220, 245, 0.4)'
      : 'none',
    transition: 'all 0.3s ease',
  }}
>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } ,transition: 'min-height 0.3s ease',}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                <Logo variant="dark" />
              </Link>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <Button
                color="inherit"
                onClick={() => scrollToSection('how-it-works')}
                sx={{ fontWeight: 600, color: '#1A2B3C', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                How It Works
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection('features')}
                sx={{ fontWeight: 600, color: '#1A2B3C', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection('testimonials')}
                sx={{ fontWeight: 600, color: '#1A2B3C', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                Testimonials
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection('contact')}
                sx={{ fontWeight: 600, color: '#1A2B3C', '&:hover': { color: '#2D5F9E', bgcolor: 'rgba(45, 95, 158, 0.05)' } }}
              >
                Contact
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {mounted && !loading && (
                <>
                  {user ? (
                    <>
                      <Box sx={{ fontWeight: 600, color: '#1A2B3C', display: { xs: 'none', sm: 'block' } }}>
                        👋 {user.full_name}
                      </Box>
                      <Button
                        component={Link}
                        href="/dashboard"
                        sx={{ fontWeight: 600, color: '#1A2B3C', display: { xs: 'none', sm: 'flex' } }}
                      >
                        My Dashboard
                      </Button>
                      <Button
                        onClick={() => logout()}
                        sx={{ fontWeight: 600, color: '#1A2B3C', display: { xs: 'none', sm: 'flex' } }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        href="/login"
                        sx={{ fontWeight: 600, color: '#1A2B3C', display: { xs: 'none', sm: 'flex' } }}
                      >
                        Login
                      </Button>
                      <Button
                        component={Link}
                        href="/register"
                        sx={{
                          fontWeight: 700,
                          color: '#2D5F9E',
                          border: '1.5px solid #2D5F9E',
                          borderRadius: '8px',
                          px: 2,
                          display: { xs: 'none', sm: 'flex' },
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
                <svg width={18} height={18} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                  <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="#3B82F6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Nova Strike
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
          {mounted && !loading && (
            <>
              {user ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/dashboard"
                      sx={{ borderRadius: 2, mb: 0.5, color: '#2D5F9E', '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.06)' } }}
                    >
                      <ListItemText primary="My Dashboard" slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => { logout(); setMobileOpen(false); }}
                      sx={{ borderRadius: 2, mb: 0.5, color: '#D64045', '&:hover': { bgcolor: 'rgba(214, 64, 69, 0.05)' } }}
                    >
                      <ListItemText primary="Logout" slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/login"
                      sx={{ borderRadius: 2, mb: 0.5, color: '#4A6080', '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.06)', color: '#2D5F9E' } }}
                    >
                      <ListItemText primary="Login" slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/register"
                      sx={{ borderRadius: 2, mb: 0.5, color: '#2D5F9E', '&:hover': { bgcolor: 'rgba(45, 95, 158, 0.06)' } }}
                    >
                      <ListItemText primary="Register" slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }} />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </>
          )}
          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton
              component={Link}
              href="/claim/new"
              sx={{
                borderRadius: 2,
                bgcolor: '#2D5F9E',
                color: 'white',
                '&:hover': { bgcolor: '#1E3A5F' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <svg width={16} height={16} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Nova Strike</span>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Hero Section */}
      <HeroSection />

      {/* Fraud Detection Section */}
      <FraudDetectionSection />

      {/* Trust bar - Interactive Partner Badges Marquee */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
          gap: 16px;
          align-items: center;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-content {
          display: flex;
          gap: 16px;
          align-items: center;
        }
      `}</style>
      <Box sx={{ bgcolor: '#EAF1FB', py: 2.5, borderBottom: '1px solid #CBD8EA', borderTop: '1px solid #CBD8EA', overflow: 'hidden', width: '100%', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
        <div className="marquee-track">
          {(() => {
            const partners = [
              { name: 'SecureShield', badge: 'Empanelled', color: '#E0E7FF', borderColor: '#4F46E5', icon: 'shield' },
              { name: 'PrimeCover', badge: 'Partner', color: '#E0F2FE', borderColor: '#0284C7', icon: 'verified' },
              { name: 'BharatGuard', badge: 'Approved', color: '#DBEAFE', borderColor: '#2563EB', icon: 'public' },
              { name: 'DataSafe', badge: 'ISO-27001', color: '#F0FDF4', borderColor: '#16A34A', icon: 'lock' },
            ];
            const marqueeItems = [
              ...partners, ...partners, ...partners, 
              ...partners, ...partners, ...partners,
            ];
            return marqueeItems.map((partner, index) => (
              <Box
                key={index}
                sx={{
                  width: '180px',
                  height: '64px',
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: 0.75,
                    borderRadius: '12px',
                    bgcolor: partner.color,
                    border: `1.5px solid ${partner.borderColor}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      boxShadow: `0 6px 12px rgba(79, 70, 229, 0.12)`,
                      transform: 'scale(1.05) translateY(-2px)',
                    },
                  }}
                >
                  {partner.icon === 'shield' && <ShieldIcon sx={{ color: partner.borderColor, fontSize: 18, flexShrink: 0 }} />}
                  {partner.icon === 'verified' && <CheckCircleIcon sx={{ color: partner.borderColor, fontSize: 18, flexShrink: 0 }} />}
                  {partner.icon === 'public' && <PublicIcon sx={{ color: partner.borderColor, fontSize: 18, flexShrink: 0 }} />}
                  {partner.icon === 'lock' && <LockIcon sx={{ color: partner.borderColor, fontSize: 18, flexShrink: 0 }} />}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: partner.borderColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        lineHeight: 1,
                      }}
                    >
                      {partner.badge}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#1e293b',
                        marginTop: '0.15rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {partner.name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ));
          })()}
        </div>
      </Box>

      {/* How it works */}
      <Box id="how-it-works" sx={{ py: 8, bgcolor: '#F7FAFF', borderBottom: '1px solid #CBD8EA' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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

          {/* Auto-Play Animation Section */}
          <AutoPlayHowItWorks />
        </Container>
      </Box>

      {/* Comparison Section — Minimal Animated SVG */}
      <Box sx={{
        py: { xs: 4, md: 8 },
        px: 2,
        background: 'linear-gradient(135deg, #F7FAFF 0%, #EDF3FB 50%, #E0EFFF 100%)',
        color: '#1A2B3C',
        borderTop: '1px solid #CBD8EA',
        borderBottom: '1px solid #CBD8EA',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fillBar {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes countUp {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 4px 12px rgba(45, 95, 158, 0.08); }
            50% { box-shadow: 0 6px 20px rgba(45, 95, 158, 0.16); }
          }
          @keyframes hoverGlow {
            0%, 100% { box-shadow: 0 2px 8px rgba(45, 95, 158, 0.06); }
            50% { box-shadow: 0 4px 14px rgba(45, 95, 158, 0.12); }
          }
          @keyframes shimmer {
            0%, 100% { box-shadow: 0 4px 16px rgba(45, 95, 158, 0.2); }
            50% { box-shadow: 0 6px 24px rgba(45, 95, 158, 0.35); }
          }
          .comparison-item { animation: slideIn 0.6s ease-out forwards; }
          .comparison-item:nth-child(2) { animation: slideInRight 0.6s ease-out forwards; }
          .stat-item { animation: countUp 0.5s ease-out forwards; }
          .card-float {
            animation: floatCard 3s ease-in-out infinite;
          }
          .stat-glow {
            animation: pulseGlow 2.5s ease-in-out infinite;
          }
          .button-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
        `}</style>

        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 6 } }}>
            <Typography
              variant="h3"
              fontWeight="800"
              sx={{
                fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif',
                mb: 1,
                fontSize: { xs: '1.6rem', sm: '2.1rem', md: '2.4rem' },
                color: '#1A2B3C',
              }}
            >
              Nova Strike vs Traditional Claims
            </Typography>
            <Typography sx={{ color: '#4A6080', maxWidth: 600, mx: 'auto', fontSize: '0.9rem' }}>
              See how our AI eliminates delays and complexity.
            </Typography>
          </Box>

          {/* Comparison Grid */}
          <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ maxWidth: 950, mx: 'auto', mb: { xs: 4, md: 6 } }}>
            {/* Traditional Process */}
            <Grid size={{ xs: 12, sm: 6 }} className="comparison-item">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Box className="card-float" sx={{
                  bgcolor: 'white',
                  border: '1px solid #E0EFFF',
                  borderRadius: '14px',
                  p: 2.5,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(202, 10, 20, 0.08)',
                    borderColor: '#DC2626',
                  },
                }}>
                  <Typography variant="h6" sx={{ color: '#4A6080', fontWeight: 700, mb: 2.5, fontSize: '0.95rem' }}>
                    Traditional Process
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { label: 'Call Surveyor', time: '2-3 days' },
                      { label: 'Schedule Visit', time: '1-2 weeks' },
                      { label: 'Physical Inspection', time: '2-4 hours' },
                      { label: 'Report Generation', time: '3-5 days' },
                      { label: 'Settlement', time: '7-14 days' },
                    ].map((item, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#1A2B3C', fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#6B7280' }}>
                            {item.time}
                          </Typography>
                        </Box>
                        <Box sx={{
                          height: 5,
                          bgcolor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ delay: 0.1 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
                            viewport={{ once: true }}
                            style={{
                              height: '100%',
                              background: '#DC2626',
                              borderRadius: '2px',
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{
                    mt: 2.5,
                    pt: 2.5,
                    borderTop: '1px solid #E5E7EB',
                    textAlign: 'center',
                  }}>
                    <Typography sx={{ color: '#DC2626', fontWeight: 700, fontSize: '1.3rem', mb: 0.3 }}>
                      34-35 days
                    </Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                      Total Time
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Nova Strike Process */}
            <Grid size={{ xs: 12, sm: 6 }} className="comparison-item" style={{ animationDelay: '0.2s' }}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Box className="card-float" sx={{
                  bgcolor: 'white',
                  border: '2px solid #2D5F9E',
                  borderRadius: '14px',
                  p: 2.5,
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(45, 95, 158, 0.02))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(45, 95, 158, 0.15)',
                    borderColor: '#1E3A5F',
                  },
                }}>
                  <Typography variant="h6" sx={{ color: '#2D5F9E', fontWeight: 700, mb: 2.5, fontSize: '0.95rem' }}>
                    Nova Strike ✨
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { label: 'Upload Photos', time: '2 min' },
                      { label: 'AI Analysis', time: '3 min' },
                      { label: 'Get Assessment', time: '5 min' },
                      { label: 'Review & Approve', time: '3 min' },
                      { label: 'Bank Transfer', time: '2 min' },
                    ].map((item, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#1A2B3C', fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#6B7280' }}>
                            {item.time}
                          </Typography>
                        </Box>
                        <Box sx={{
                          height: 5,
                          bgcolor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ delay: 0.1 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
                            viewport={{ once: true }}
                            style={{
                              height: '100%',
                              background: '#16A34A',
                              borderRadius: '2px',
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{
                    mt: 2.5,
                    pt: 2.5,
                    borderTop: '1px solid #E5E7EB',
                    textAlign: 'center',
                    bgcolor: 'rgba(22, 163, 74, 0.04)',
                    borderRadius: '8px',
                    mx: -1.5,
                    px: 1.5,
                    py: 1.5,
                  }}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <Typography sx={{ color: '#16A34A', fontWeight: 700, fontSize: '1.3rem', mb: 0.3 }}>
                        15 minutes
                      </Typography>
                    </motion.div>
                    <Typography sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                      Total Time
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Stats Row */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
            maxWidth: 850,
            mx: 'auto',
            mb: { xs: 4, md: 6 },
          }}>
            {[
              { stat: '56x', label: 'Faster' },
              { stat: '99.9%', label: 'Accurate' },
              { stat: '12000+', label: 'Claims Settled' },
              { stat: '₹0', label: 'Surveyor Fee' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="stat-item"
                style={{ animationDelay: `${idx * 0.1}s` }}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Box className="stat-glow" sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'white',
                  border: '1px solid #CBD8EA',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: '#2D5F9E',
                    boxShadow: '0 6px 16px rgba(45, 95, 158, 0.12)',
                  },
                }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#2D5F9E', mb: 0.3 }}>
                      {item.stat}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#4A6080', fontWeight: 700, letterSpacing: 0.5 }}>
                      {item.label}
                    </Typography>
                  </motion.div>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* CTA */}
          <Box sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <Button
                component={Link}
                href="/claim/new"
                variant="contained"
                className="button-shimmer"
                sx={{
                  px: { xs: 2.5, md: 4 },
                  py: 1.2,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2D5F9E 0%, #1E3A5F 100%)',
                  boxShadow: '0 4px 16px rgba(45, 95, 158, 0.2)',
                  color: 'white',
                  textTransform: 'none',
                  letterSpacing: 0.3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1F35 100%)',
                    boxShadow: '0 6px 24px rgba(45, 95, 158, 0.3)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                }}
              >
                Start Your Claim Now
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

   {/* Features - Creative SaaS Design */}
<Box id="features" sx={{ py: { xs: 8, md: 14 }, bgcolor: '#F7FAFF', position: 'relative', overflow: 'hidden' }}>
  {/* Animated Background Elements */}
  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0; }
      50% { opacity: 0.3; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    @keyframes slide-in-left {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .feature-card-left { animation: slide-in-left 0.6s ease-out forwards; }
    .feature-card-right { animation: slide-in-right 0.6s ease-out forwards; }
    .feature-card-center { animation: scale-in 0.6s ease-out forwards; }
  `}</style>

  {/* Decorative Floating Elements */}
  <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,95,158,0.08) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite', zIndex: 0 }} />
  <Box sx={{ position: 'absolute', bottom: '15%', right: '8%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,196,0.06) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite', animationDelay: '1s', zIndex: 0 }} />

  <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
    {/* Header */}
    <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2, px: 2.5, py: 0.75, bgcolor: 'rgba(45,95,158,0.06)', borderRadius: '30px', border: '1px solid rgba(45,95,158,0.15)' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2D5F9E', animation: 'pulse-ring 2s infinite' }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#2D5F9E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Superior Intelligence
          </Typography>
        </Box>
        <Typography
          variant="h2"
          sx={{ 
            color: '#1A2B3C', 
            mb: 2, 
            fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif',
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          Built for Indian Roads
        </Typography>
        <Typography sx={{ color: '#4A6080', maxWidth: 680, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.7 }}>
          Engineered around IRDA norms and calibrated for the Indian automotive ecosystem.
        </Typography>
      </motion.div>
    </Box>

    {/* Feature Cards - Compact 2x2 Grid */}
    <Box sx={{ 
      display: 'grid', 
      gap: 2, 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      mb: 4,
    }}>
      {[
        { 
          icon: CameraIcon, 
          title: 'Photo Assessment', 
          desc: 'AI analyzes damage from phone photos',
          color: '#2D5F9E',
          bg: 'rgba(45,95,158,0.06)',
        },
        { 
          icon: ZapIcon, 
          title: '15-Min Settlement', 
          desc: 'Instant processing, quick payouts',
          color: '#16A34A',
          bg: 'rgba(22,163,74,0.06)',
        },
        { 
          icon: GavelIcon, 
          title: 'IRDA Compliant', 
          desc: 'Section 64UM certified process',
          color: '#F59E0B',
          bg: 'rgba(245,158,11,0.06)',
        },
        { 
          icon: LockIcon, 
          title: 'Bank Security', 
          desc: 'AES-256 encrypted & audited',
          color: '#7C3AED',
          bg: 'rgba(124,58,237,0.06)',
        },
      ].map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Box sx={{
            bgcolor: 'white',
            borderRadius: '14px',
            p: 2.5,
            border: '1px solid #E0EFFF',
            boxShadow: '0 2px 12px rgba(30,58,95,0.06)',
            height: '100%',
            transition: 'all 0.3s ease',
            cursor: 'default',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(30,58,95,0.12)',
              borderColor: feature.color,
              '& .feature-icon-box': {
                bgcolor: feature.color,
                transform: 'scale(1.05)',
              },
              '& .feature-icon': {
                color: 'white',
              },
            },
          }}>
            <Box 
              className="feature-icon-box"
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                bgcolor: feature.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                transition: 'all 0.3s ease',
              }}
            >
              <feature.icon className="feature-icon" sx={{ fontSize: 22, color: feature.color, transition: 'color 0.3s ease' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: '#1A2B3C', mb: 0.5, fontSize: '0.95rem' }}>
              {feature.title}
            </Typography>
            <Typography sx={{ color: '#4A6080', fontSize: '0.8rem', lineHeight: 1.5 }}>
              {feature.desc}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>

    {/* Compact Stats Row */}
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Box sx={{
        bgcolor: 'white',
        borderRadius: '12px',
        py: 2,
        px: 3,
        border: '1px solid #E0EFFF',
        boxShadow: '0 2px 12px rgba(30,58,95,0.06)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        {[
          { value: '99.2%', label: 'Accuracy', color: '#16A34A' },
          { value: '<3min', label: 'Processing', color: '#2D5F9E' },
          { value: '24/7', label: 'Available', color: '#F59E0B' },
          { value: '₹0', label: 'Hidden Fees', color: '#7C3AED' },
        ].map((stat, i) => (
          <Box key={i} sx={{ textAlign: 'center', minWidth: 80 }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: stat.color, lineHeight: 1.2 }}>
              {stat.value}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#4A6080', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </motion.div>
  </Container>
</Box>

      {/* Testimonials - Masonry Scrolling Wall */}
      <Box
        id="testimonials"
        sx={{
          py: { xs: 10, md: 14 },
          background: '#F7FAFF',
          borderTop: '1px solid #CBD8EA',
          borderBottom: '1px solid #CBD8EA'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 9 }}>
            <Chip
              label="Wall of Proof"
              sx={{
                mb: 2,
                bgcolor: '#E0EFFF',
                color: '#2D5F9E',
                borderColor: '#BDD9F5',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
              }}
              variant="outlined"
            />
            <Typography
              variant="h2"
              fontWeight="800"
              sx={{ color: '#1A2B3C', mb: 2, fontFamily: 'var(--font-dm-serif, "DM Serif Display"), serif', fontSize: { xs: '2rem', md: '3.25rem' } }}
            >
              Trusted by Thousands
            </Typography>
            <Typography sx={{ color: '#4A6080', maxWidth: 650, mx: 'auto' }}>
              Real settlements. Real policyholders. Built with the consistency and trust standards of a premium insurance platform.
            </Typography>
          </Box>

          {/* Masonry Scrolling Testimonial Wall */}
          <style>{`
            @keyframes scrollUp1 {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
            @keyframes scrollUp2 {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
            @keyframes scrollUp3 {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
          `}</style>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 1.5, sm: 2, md: 3 },
              height: { xs: '400px', sm: '500px', md: '600px' },
              overflow: 'hidden',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
              '&:hover .scroll-track': {
                animationPlayState: 'paused',
              }
            }}
          >
            {/* Column 1 - 40s scroll */}
            <Box sx={{ overflow: 'hidden' }}>
              <Box
                className="scroll-track"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.5, sm: 2, md: 2 },
                  animation: 'scrollUp1 40s linear infinite',
                }}
              >
                {[0, 3, 6].map((idx) => (
                  <Box key={`col1-${idx}`}>
                    <TestimonialCardComponent testimonial={testimonials[idx]} />
                  </Box>
                ))}
                {[0, 3, 6].map((idx) => (
                  <Box key={`col1-dup-${idx}`}>
                    <TestimonialCardComponent testimonial={testimonials[idx]} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Column 2 - 30s scroll */}
            <Box sx={{ overflow: 'hidden' }}>
              <Box
                className="scroll-track"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.5, sm: 2, md: 2 },
                  animation: 'scrollUp2 30s linear infinite',
                }}
              >
                {[1, 4, 7].map((idx) => (
                  <Box key={`col2-${idx}`}>
                    <TestimonialCardComponent testimonial={testimonials[idx]} />
                  </Box>
                ))}
                {[1, 4, 7].map((idx) => (
                  <Box key={`col2-dup-${idx}`}>
                    <TestimonialCardComponent testimonial={testimonials[idx]} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Column 3 - 50s scroll */}
            <Box sx={{ overflow: 'hidden' }}>
              <Box
                className="scroll-track"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.5, sm: 2, md: 2 },
                  animation: 'scrollUp3 50s linear infinite',
                }}
              >
                {[2, 5, 8].map((idx) => (
                  <Box key={`col3-${idx}`}>
                    <TestimonialCardComponent testimonial={testimonials[idx]} />
                  </Box>
                ))}
                {[2, 5, 8].map((idx) => (
                  <Box key={`col3-dup-${idx}`}>
                    <TestimonialCardComponent testimonial={testimonials[idx]} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer — Light Theme */}
      <Box id="contact" sx={{ bgcolor: '#F0F6FF', color: '#1A2B3C', py: { xs: 8, md: 10 }, borderTop: '1px solid #CBD8EA' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 6, md: 8 } }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Logo variant="dark" />
                </Box>
              </Link>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#4A6080', fontSize: '0.875rem' }}>
                India's leading AI claim engine. Settling thousands of motor claims every month with IRDA-authorised digital inspections.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#1A2B3C', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link
                  href="/claim/new"
                  style={{ color: '#4A6080', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2D5F9E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#4A6080'}
                >
                  <svg width={14} height={14} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Nova Strike
                </Link>
                <Link
                  href="/dashboard"
                  style={{ color: '#4A6080', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2D5F9E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#4A6080'}
                >
                  My Dashboard
                </Link>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', color: '#4A6080', transition: 'color 0.2s', '&:hover': { color: '#2D5F9E' } }}
                  onClick={() => scrollToSection('how-it-works')}
                >
                  How It Works
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#1A2B3C', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Ecosystem Partners</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['SecureShield Insurance', 'PrimeCover General', 'BharatGuard Insurance'].map(p => (
                  <Typography key={p} variant="body2" sx={{ color: '#4A6080' }}>{p}</Typography>
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#1A2B3C', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>Support</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4A6080' }}>
                  <PhoneIcon sx={{ fontSize: 16 }} /> 1800-NOVA-247
                </Typography>
                <Link href="mailto:support@claimnova.in" style={{ color: '#4A6080', textDecoration: 'none', fontSize: '0.875rem' }}>
                  📧 support@claimnova.in
                </Link>
                <Typography variant="caption" sx={{ color: '#6B7280', mt: 1 }}>Regulatory Ref: IGOV/2024/00421</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: '#CBD8EA', mb: { xs: 4, md: 6 } }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2.5, alignItems: 'center', pt: 2 }}>
            <Typography variant="caption" sx={{ color: '#4A6080', fontSize: '0.75rem' }}>© 2026 ClaimNova. All rights reserved.</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: { xs: 2, sm: 3.5 } }}>
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    color: '#4A6080',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2D5F9E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#4A6080'}
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
