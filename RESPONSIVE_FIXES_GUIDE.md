# Responsive Design - Implementation Guide
**Quick-Start Fixes for High-Priority Issues**

---

## 1️⃣ FIX: OtpInput.tsx (CRITICAL)

### Current Code (Lines 41-52)
```typescript
<input
    className={cn(
        "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl ...",
        // ... other classes
    )}
/>
```

### Problem Analysis
- **Current mobile:** 48px × 56px with 8px gap
- **Total width needed:** 6 inputs (48px) + 5 gaps (8px) = 328px
- **Device width:** 320px (iPhone SE) → **8px overflow per side = horizontal scroll**
- **Touch target:** 48×56px is borderline (needs 44-48px minimum)

### Fixed Code
```typescript
<div className="flex justify-between gap-1 sm:gap-1.5 md:gap-2 max-w-full px-2 mx-auto">
    {otp.map((digit, index) => (
        <motion.div key={index} whileTap={{ scale: 0.95 }}>
            <input
                className={cn(
                    // Mobile: 40px (allows 6 × 40 + 5 × 4gap = 260px < 320px)
                    // Tablet: 48px
                    // Desktop: 56px
                    "w-9 h-12 sm:w-11 sm:h-13 md:w-12 md:h-14 lg:w-14 lg:h-16",
                    "text-center text-lg sm:text-xl md:text-2xl font-semibold",
                    "bg-white border-2 rounded-md transition-all duration-200 outline-none",
                    // Responsive styling
                    error
                        ? "border-red-500 bg-red-50 text-red-700"
                        : digit
                            ? "border-[#0051C3] shadow-[0_0_15px_rgba(0,81,195,0.15)] text-gray-900"
                            : "border-gray-200 focus:border-[#0051C3] focus:shadow-[0_0_15px_rgba(0,81,195,0.15)] text-gray-900",
                    disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                )}
                // ... rest of props
            />
        </motion.div>
    ))}
</div>
```

### Alternative: Using MUI Box
```typescript
import { Box, TextField } from '@mui/material';

<Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    gap: { xs: 1, sm: 1.5, md: 2 },
    maxWidth: '100%',
    px: 2,
    mx: 'auto'
}}>
    {otp.map((digit, index) => (
        <TextField
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            sx={{
                flex: '0 0 auto',
                width: { xs: '36px', sm: '44px', md: '48px', lg: '56px' },
                height: { xs: '48px', sm: '52px', md: '60px', lg: '64px' },
                '& .MuiOutlinedInput-input': {
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    textAlign: 'center',
                    padding: 0,
                },
                '& .MuiOutlinedInput-root': {
                    height: '100%',
                }
            }}
        />
    ))}
</Box>
```

---

## 2️⃣ FIX: page.tsx Testimonial Card (CRITICAL)

### Current Code Issues
```typescript
const TestimonialCardComponent = ({ testimonial }: ...) => (
  <Box sx={{
    bgcolor: 'white',
    border: '1px solid #CBD8EA',
    borderRadius: '16px',
    p: 3,                      // ❌ 24px on all screens
    flexShrink: 0,
    boxShadow: '0 2px 12px rgba(30,58,95,0.06)',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <Box sx={{ width: 40, height: 40, ... }}>  // ❌ Fixed avatar
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '14px', ... }}> {/* ❌ Fixed */}
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>  // ❌ No responsive
        <Typography sx={{ fontSize: '13px' }}> {/* ❌ Fixed */}
```

### Fixed Code
```typescript
const TestimonialCardComponent = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Box sx={{
    bgcolor: 'white',
    border: '1px solid #CBD8EA',
    borderRadius: { xs: '12px', sm: '16px' },
    p: { xs: 2, sm: 2.5, md: 3 },              // ✅ Responsive padding
    flexShrink: 0,
    minWidth: { xs: 'calc(100vw - 32px)', sm: '360px', md: '420px', lg: '450px' },
    mx: { xs: 1, sm: 0 },                      // ✅ Horizontal margin on mobile
    boxShadow: '0 2px 12px rgba(30,58,95,0.06)',
    // Add media query for overflow handling
    '@media (max-width: 600px)': {
      minWidth: 'auto',
      width: '100%',
    }
  }}>
    {/* Header Row - Stack on Mobile */}
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'flex-start', sm: 'center' },
      gap: { xs: 1, sm: 1.5 },
      mb: { xs: 2, sm: 2 }
    }}>
      <Box sx={{
        width: { xs: 32, sm: 40, md: 44 },  // ✅ Responsive avatar
        height: { xs: 32, sm: 40, md: 44 },
        borderRadius: '50%',
        bgcolor: testimonial.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: { xs: '12px', sm: '14px' },  // ✅ Responsive font
        flexShrink: 0,
      }}>
        {testimonial.initials}
      </Box>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>  // ✅ minWidth: 0 for flex text truncation
        <Typography sx={{
          color: '#1A2B3C',
          fontWeight: 600,
          fontSize: { xs: '13px', sm: '14px', md: '15px' },  // ✅ Responsive
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}>
          {testimonial.name}
        </Typography>
        <Typography sx={{
          color: '#4A6080',
          fontSize: { xs: '11px', sm: '12px', md: '13px' },  // ✅ Responsive
          wordBreak: 'break-word',
        }}>
          {testimonial.location}
        </Typography>
      </Box>

      {/* Amount Box - Adapt Position */}
      <Box sx={{
        textAlign: { xs: 'left', sm: 'right' },
        flexShrink: 0,
        alignSelf: { xs: 'flex-start', sm: 'center' },
      }}>
        <Typography sx={{
          color: '#2D5F9E',
          fontWeight: 700,
          fontSize: { xs: '12px', sm: '13px', md: '14px' },  // ✅ Responsive
        }}>
          {testimonial.amount}
        </Typography>
        <Typography sx={{
          color: '#4A6080',
          fontSize: { xs: '10px', sm: '11px', md: '12px' },  // ✅ Responsive
        }}>
          in {testimonial.time}
        </Typography>
      </Box>
    </Box>

    {/* Quote - Responsive Font */}
    <Typography sx={{
      color: '#4A6080',
      fontSize: { xs: '12px', sm: '13px', md: '14px' },  // ✅ Responsive
      lineHeight: { xs: 1.5, sm: 1.6, md: 1.65 },
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}>
      "{testimonial.quote}"
    </Typography>
  </Box>
);
```

---

## 3️⃣ FIX: HeroSlideshow.tsx Button & Typography (HIGH)

### Current Issues
```typescript
// ❌ No gap between buttons on mobile
<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
    <Button ... sx={{ width: { xs: '100%', sm: 'auto' }, px: 4, ... }} />
    <Button ... sx={{ width: { xs: '100%', sm: 'auto' }, ... }} />
</Box>

// ❌ Typography with uneven scaling
<Typography variant="h2" sx={{
    fontSize: { xs: '2rem', sm: '2.6rem', md: '4.5rem' },
    ...
}} />
```

### Fixed Code
```typescript
{/* Buttons with Responsive Spacing */}
<Box sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 1.5, sm: 2 },
    mb: { xs: 3, sm: 4 },
    width: { xs: '100%', sm: 'auto' },
}}>
    <Button
        component={Link}
        href="/claim/new"
        variant="contained"
        color="primary"
        size="large"
        sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
            fontWeight: 700,
            borderRadius: 2.5,
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
            background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
            minHeight: { xs: '44px', sm: '48px' },  // ✅ Touch target
            '&:hover': {
                boxShadow: '0 12px 30px rgba(59, 130, 246, 0.5)',
                background: 'linear-gradient(135deg, #2563EB, #60A5FA)'
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1
        }}>
        <svg width={18} height={18} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 6L10 20H18L10 30L22 16H14L22 6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Launch Nova Strike</span>
    </Button>
    
    <Button
        component={Link}
        href="/claim/track"
        variant="outlined"
        size="large"
        sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.55)',
            px: { xs: 3, sm: 4 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
            fontWeight: 600,
            borderRadius: 2.5,
            minHeight: { xs: '44px', sm: '48px' },  // ✅ Touch target
            '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
            }
        }}>
        📡 Track My Claim
    </Button>
</Box>

{/* Responsive Heading with Better Scaling */}
<Typography
    variant="h1"
    fontWeight="800"
    sx={{
        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3.5rem', lg: '4.5rem' },  // ✅ Smoother scaling
        lineHeight: { xs: 1.15, sm: 1.15, md: 1.1 },
        color: 'white'
    }}>
    {slide.headline.split(' ').map((word, i) => (
        <motion.span
            key={i}
            style={{ display: 'inline-block', marginRight: '0.4em' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 + 0.3 }}
        >
            {word}
        </motion.span>
    ))}
</Typography>

{/* Responsive Subheading */}
<Typography
    variant="h6"
    sx={{
        color: 'rgba(224, 236, 255, 0.85)',
        mb: { xs: 3, sm: 4 },
        fontWeight: 400,
        maxWidth: { xs: '100%', sm: 650 },
        fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem', lg: '1.2rem' },  // ✅ Responsive
        lineHeight: { xs: 1.5, sm: 1.55, md: 1.6 },
    }}>
    {slide.subheadline}
</Typography>

{/* Responsive Chips */}
<Box sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: { xs: 0.75, sm: 1 },
}}>
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
                letterSpacing: 0.1,
                fontSize: { xs: '11px', sm: '12px', md: '13px' },  // ✅ Responsive
                '& .MuiChip-label': {
                    px: { xs: 0.75, sm: 1, md: 1.25 },  // ✅ Responsive padding
                    fontSize: 'inherit',
                }
            }}
        />
    ))}
</Box>
```

---

## 4️⃣ FIX: HeroSection.tsx Animation Blobs (HIGH)

### Current Code
```typescript
<Box
    sx={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '400px',      // ❌ FIXED
        height: '400px',     // ❌ FIXED
        background: 'radial-gradient(...)',
        borderRadius: '50%',
        filter: 'blur(40px)',
    }}
/>
```

### Fixed Code
```typescript
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
        top: { xs: '-5%', md: '-10%' },                    // ✅ Responsive top
        left: { xs: '2%', md: '-5%' },                     // ✅ Responsive left
        width: { xs: '200px', sm: '280px', md: '400px', lg: '500px' },  // ✅ Responsive
        height: { xs: '200px', sm: '280px', md: '400px', lg: '500px' }, // ✅ Responsive
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none',
    }}
/>

{/* Same pattern for other blobs */}
<Box
    component={motion.div}
    animate={{
        scale: [1, 0.8, 1],
        rotate: [0, -45, 0],
    }}
    transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 5,
    }}
    sx={{
        position: 'absolute',
        bottom: { xs: '-15%', md: '-5%' },                 // ✅ Responsive
        right: { xs: '-10%', md: '5%' },                   // ✅ Responsive
        width: { xs: '150px', sm: '220px', md: '350px', lg: '420px' },  // ✅ Responsive
        height: { xs: '150px', sm: '220px', md: '350px', lg: '420px' },
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none',
    }}
/>

{/* Grid background pattern - also responsive */}
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
        backgroundSize: { xs: '30px 30px', sm: '40px 40px', md: '50px 50px' },  // ✅ Responsive
        backgroundPosition: '0 0',
        pointerEvents: 'none',
        zIndex: 0,
    }}
/>
```

---

## 5️⃣ FIX: TestimonialCarousel.tsx Card Padding (HIGH)

### Current Code
```typescript
CardContent sx={{ p: { xs: 3, sm: 5 } }}  // ❌ Only 2 breakpoints
```

### Fixed Code
```typescript
CardContent sx={{
    p: { xs: 2.5, sm: 3, md: 4, lg: 5 }   // ✅ Full coverage
}}
```

Full component:
```typescript
<Card sx={{
    bgcolor: '#0F1A2E',
    borderRadius: { xs: 3, sm: 4 },        // ✅ Responsive radius
    border: '1px solid rgba(103, 232, 249, 0.22)',
    background: 'linear-gradient(145deg, #0F1A2E 0%, #111F36 100%)',
    boxShadow: '0 12px 30px rgba(3, 10, 24, 0.45)',
    position: 'relative'
}}>
    <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: { xs: '3px', sm: '4px' },  // ✅ Responsive line
        background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)'
    }} />
    
    <CardContent sx={{
        p: { xs: 2.5, sm: 3, md: 4, lg: 5 }  // ✅ Full Coverage
    }}>
        <Box sx={{ display: 'flex', mb: { xs: 2, sm: 3 } }}>
            {[...Array(t.rating)].map((_, j) => (
                <StarIcon key={j} sx={{
                    color: '#fbbf24',
                    fontSize: { xs: 20, sm: 22, md: 24 }  // ✅ Responsive
                }} />
            ))}
        </Box>
        
        <Typography variant="h6" sx={{
            fontStyle: 'italic',
            mb: { xs: 3, sm: 4 },
            fontWeight: 400,
            lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
            color: 'rgba(236, 245, 255, 0.95)',
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }  // ✅ Responsive
        }}>
            "{t.text}"
        </Typography>
        
        <Divider sx={{
            mb: { xs: 2, sm: 3 },
            borderColor: 'rgba(148, 163, 184, 0.26)'
        }} />
        
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 1.5 },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' }
        }}>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{
                    color: '#E6F0FF',
                    fontSize: { xs: '0.95rem', sm: '1rem' }  // ✅ Responsive
                }}>
                    {t.name}
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'rgba(196, 212, 235, 0.85)',
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }  // ✅ Responsive
                }}>
                    {t.city} • {t.vehicle}
                </Typography>
            </Box>
            
            <Box sx={{
                textAlign: { xs: 'left', sm: 'right' },
                bgcolor: 'rgba(20, 184, 166, 0.08)',
                border: '1px solid rgba(20, 184, 166, 0.28)',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: { xs: 1, sm: 2 }
            }}>
                <Typography variant="subtitle2" sx={{
                    color: '#67E8F9',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.9rem', sm: '1rem' }  // ✅ Responsive
                }}>
                    {t.amount}
                </Typography>
                <Typography variant="caption" sx={{
                    color: 'rgba(196, 212, 235, 0.85)',
                    fontSize: { xs: '0.75rem', sm: '0.85rem' }  // ✅ Responsive
                }}>
                    in {t.time}
                </Typography>
            </Box>
        </Box>
    </CardContent>
</Card>
```

---

## 6️⃣ FIX: Indicator Dots Sizing (MEDIUM)

### Current Code
```typescript
<Box sx={{
    width: current === i ? 32 : 12,   // ❌ FIXED
    height: 12,
}}/>
```

### Fixed Code
```typescript
<Box sx={{
    width: current === i
        ? { xs: 20, sm: 24, md: 32 }   // ✅ Responsive active
        : { xs: 8, sm: 10, md: 12 },   // ✅ Responsive inactive
    height: { xs: 8, sm: 10, md: 12 }, // ✅ Responsive
    borderRadius: 6,
    bgcolor: current === i ? 'primary.main' : 'rgba(255,255,255,0.3)',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    boxShadow: current === i ? '0 0 10px rgba(59, 130, 246, 0.8)' : 'none'
}}/>
```

---

## 📋 Testing Checklist

After implementing fixes, test on these viewports:

```
MOBILE:
- iPhone SE (375px × 812px)
- iPhone 12 (390px × 844px)
- Android (360px × 800px)

TABLET:
- iPad (768px × 1024px, portrait)
- iPad Air (820px × 1180px, portrait)
- iPad Pro 12.9" (1024px × 1366px, portrait)

DESKTOP:
- Laptop (1440px × 900px)
- Large Desktop (1920px × 1080px)
- Ultrawide (2560px × 1440px)

LANDSCAPE:
- iPhone landscape (812px × 375px)
- iPad landscape (1024px × 768px)
```

### Test Checklist
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets ≥ 44px × 44px on mobile
- [ ] Typography scales smoothly between breakpoints
- [ ] Images/blobs don't overflow on any screen
- [ ] Buttons don't stack awkwardly on tablet
- [ ] OTP inputs visible without overflow
- [ ] Modals/cards fit within viewport
- [ ] Form inputs usable on mobile (keyboard)
- [ ] Images load responsively (optimize for bandwidth)

---

**Last Updated:** April 5, 2026
