'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClaimNovaLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <style>{`
            @keyframes cometSpin {
              to { transform: rotate(360deg); }
            }
            @keyframes logoPulse {
              0%, 100% { opacity: 0.9; }
              50%       { opacity: 1;   }
            }
          `}</style>

          {/* Logo — starts big, zooms out to normal like CodeHelp */}
          <motion.div
            initial={{ scale: 2.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'relative',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Comet 1 — clockwise */}
            <div style={{
              position: 'absolute',
              inset: -14,
              borderRadius: '50%',
              border: '2.5px solid transparent',
              borderTopColor: '#3B82F6',
              borderRightColor: 'rgba(59,130,246,0.3)',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.8))',
              animation: 'cometSpin 1.6s linear infinite',
            }} />

            {/* Comet 2 — counter-clockwise */}
            <div style={{
              position: 'absolute',
              inset: -14,
              borderRadius: '50%',
              border: '2.5px solid transparent',
              borderBottomColor: '#60b8ff',
              borderLeftColor: 'rgba(96,184,255,0.3)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              filter: 'drop-shadow(0 0 4px rgba(96,184,255,0.8))',
              animation: 'cometSpin 1.6s linear infinite reverse',
            }} />

            {/* Bolt SVG — same as navbar, no background box */}
            <svg
              width={64}
              height={64}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'relative',
                zIndex: 2,
                animation: 'logoPulse 2s ease-in-out infinite',
              }}
            >
              <path
                d="M22 6L10 20H18L10 30L22 16H14L22 6Z"
                fill="#3B82F6"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}