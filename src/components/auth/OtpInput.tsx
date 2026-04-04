'use client';

import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OtpInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    onChange?: (otp: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export function OtpInput({ length = 6, onComplete, onChange, disabled = false, error = false }: OtpInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (disabled) return;

        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // take last character if multiple
        setOtp(newOtp); 

        const otpString = newOtp.join('');
        onChange?.(otpString);

        if (otpString.length === length && !newOtp.includes('')) {
            onComplete(otpString);
        }

        // Move to next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;

        const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
        if (!/^\d+$/.test(pastedData)) return; // Only paste numbers

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < length) newOtp[i] = char;
        });

        setOtp(newOtp);
        const otpString = newOtp.join('');
        onChange?.(otpString);

        if (otpString.length === length) {
            onComplete(otpString);
            inputRefs.current[length - 1]?.focus();
        } else {
            inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
        }
    };

    return (
        <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otp.map((digit, index) => (
                <motion.div
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    animate={digit && !error ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.2 }}
                >
                    <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={cn(
                            "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-semibold bg-white border-2 rounded-md transition-all duration-200 outline-none",
                            error
                                ? "border-red-500 bg-red-50 text-red-700 shake-animation"
                                : digit
                                    ? "border-[#0051C3] shadow-[0_0_15px_rgba(0,81,195,0.15)] text-gray-900"
                                    : "border-gray-200 focus:border-[#0051C3] focus:shadow-[0_0_15px_rgba(0,81,195,0.15)] text-gray-900",
                            disabled ? "bg-gray-50 opacity-50 cursor-not-allowed" : ""
                        )}
                    />
                </motion.div>
            ))}
        </div>
    );
}
