'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClaimNovaLoader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + 1;
      });
    }, 28); // 2.8s to fill

    // Phase transitions
    setTimeout(() => setPhase(1), 500);   // logo appears
    setTimeout(() => setPhase(2), 1200);  // text appears
    setTimeout(() => setPhase(3), 2000);  // tagline types
    setTimeout(() => setPhase(4), 2800);  // exit begins
    setTimeout(() => setShow(false), 3300); // unmount

    return () => clearInterval(progressTimer);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Centered content */}
          {phase < 4 && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: '#0a0a0a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}>
              {/* Favicon logo */}
              <motion.img
                src="/favicon.svg"
                alt="ClaimNova"
                initial={{ scale: 0, opacity: 0 }}
                animate={phase >= 1 ? {
                  scale: 1,
                  opacity: 1,
                  filter: 'drop-shadow(0 0 30px #2563EB) drop-shadow(0 0 60px #7C3AED)',
                } : {}}
                transition={{ duration: 0.6, ease: 'backOut' }}
                className={phase >= 2 ? 'cn-pulse-glow' : ''}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                }}
              />

              {/* ClaimNova text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.5px',
                }}
              >
                Claim<span style={{
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Nova</span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                style={{
                  color: '#666',
                  fontSize: 14,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                AI-Powered Insurance Claims
              </motion.p>

              {/* Progress bar */}
              <div style={{
                width: 200,
                height: 2,
                background: '#222',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 48,
                left: '50%',
                transform: 'translateX(-50%)',
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
                    width: `${progress}%`,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          )}

          {/* Split exit overlays — only during exit phase */}
          {phase >= 4 && (
            <>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: '-100%' }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '50%',
                  background: '#0a0a0a',
                  zIndex: 100000,
                }}
              />
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: '100%' }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50%',
                  background: '#0a0a0a',
                  zIndex: 100000,
                }}
              />
            </>
          )}

          {/* Pulse glow keyframes */}
          <style>{`
            @keyframes cn-pulse-glow {
              0%, 100% { filter: drop-shadow(0 0 20px #2563EB); }
              50% { filter: drop-shadow(0 0 40px #7C3AED) drop-shadow(0 0 80px #2563EB); }
            }
            .cn-pulse-glow { animation: cn-pulse-glow 2s ease-in-out infinite; }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
