import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_purposes_only';

// Ensure secret is a proper Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Hash a password
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hash
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password from DB
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 * @param {object} payload - The payload to sign
 * @param {string} expiresIn - Expiration time (e.g., '7d', '2h')
 * @returns {Promise<string>} - The signed JWT string
 */
export async function generateToken(payload: any, expiresIn: string = '7d'): Promise<string> {
    const alg = 'HS256';

    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secret);
}

/**
 * Verify a JWT token
 * @param {string} token - The JWT string to verify
 * @returns {Promise<any | null>} - The decoded payload, or null if invalid
 */
export async function verifyToken(token: string): Promise<any | null> {
    try {
        const { payload } = await jose.jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
}

/**
 * Generate a random 6-digit OTP
 * @returns {string} - The 6-digit OTP string
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
