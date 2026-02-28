/**
 * Send an OTP via Fast2SMS
 * @param {string} mobile - The 10-digit mobile number
 * @param {string} otp - The 6-digit OTP code to send
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendOTP(mobile: string, otp: string): Promise<{ success: boolean; message: string }> {
    const apiKey = process.env.FAST2SMS_API_KEY;

    // For development/demo without a real key
    if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
        console.log(`[DEV MODE] Simulated SMS sent to ${mobile}: Your OTP is ${otp}`);
        return { success: true, message: 'Simulated OTP sent (Dev Mode)' };
    }

    try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                authorization: apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                route: 'otp',
                variables_values: otp,
                numbers: mobile,
            }),
        });

        const data = await response.json();

        if (response.ok && data.return) {
            return { success: true, message: 'OTP sent successfully' };
        } else {
            console.error('Fast2SMS API Error:', data);
            return { success: false, message: data.message || 'Failed to send OTP' };
        }
    } catch (error: any) {
        console.error('Error sending SMS via Fast2SMS:', error);
        return { success: false, message: error.message || 'Internal error sending SMS' };
    }
}
