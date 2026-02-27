import axios from 'axios';

const COURIER_API_URL = 'https://api.courier.com/send';
const AUTH_TOKEN = process.env.COURIER_AUTH_TOKEN;

export type NotificationChannel = 'whatsapp' | 'sms' | 'email';

export interface NotificationPayload {
    to: string;
    message: string;
    type: 'status_update' | 'payment_processed' | 'fraud_alert';
    data?: Record<string, any>;
}

export const sendNotification = async (payload: NotificationPayload, channel: NotificationChannel = 'whatsapp') => {
    if (!AUTH_TOKEN) {
        console.warn('[Notification] COURIER_AUTH_TOKEN not found. Falling back to terminal log.');
        console.log(`[REAL-TIME SYNC] [${channel.toUpperCase()}] to ${payload.to}: ${payload.message}`);
        return { success: true, messageId: 'dev-mode' };
    }

    try {
        const response = await axios.post(
            COURIER_API_URL,
            {
                message: {
                    to: {
                        phone_number: payload.to,
                    },
                    content: {
                        title: "ClaimNova Update",
                        body: payload.message,
                    },
                    data: payload.data,
                    routing: {
                        method: "single",
                        channels: [channel === 'whatsapp' ? 'whatsapp' : channel === 'sms' ? 'sms' : 'email'],
                    },
                },
            },
            {
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            success: true,
            messageId: response.data.requestId,
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        console.error('Courier API call failed:', error.response?.data || error.message);
        throw error;
    }
};

export const notifyClaimStatusChange = async (claimId: string, status: string, name: string) => {
    const messages: Record<string, string> = {
        approved: `Hi ${name}, your claim ${claimId} has been APPROVED! Please provide bank details in the app for instant settlement.`,
        rejected: `Hi ${name}, your claim ${claimId} has been rejected after review. Please check the app for detailed reasons.`,
        escalated: `Hi ${name}, your claim ${claimId} requires additional review by our senior team. We will update you shortly.`,
        settled: `Hi ${name}, the settlement for claim ${claimId} has been processed. Funds should reach your account in 48 hours.`,
    };

    if (messages[status]) {
        return sendNotification({
            to: '+919900000000', // In production, this would come from policy database
            message: messages[status],
            type: 'status_update',
            data: { claimId, status }
        });
    }
};
