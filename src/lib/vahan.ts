import axios from 'axios';

export interface VahanVehicleDetails {
    registrationNumber: string;
    ownerName: string;
    model: string;
    fuelType: string;
    registrationDate: string;
    engineNumber: string;
    chassisNumber: string;
    insuranceExpiry: string;
}

/**
 * Verifies vehicle details using VAHAN API (Production Gateway)
 * Falls back to policy check if API key is missing.
 */
export const verifyVehicleWithVahan = async (regNumber: string): Promise<VahanVehicleDetails | null> => {
    const apiKey = process.env.VAHAN_API_KEY;

    if (!apiKey) {
        console.warn('[VAHAN] API Key missing. Skipping real-time vehicle verification.');
        return null;
    }

    try {
        // Example implementation using a common VAHAN aggregator API (e.g. RapidAPI)
        const response = await axios.get(`https://vahan-api.p.rapidapi.com/v1/vehicle/${regNumber}`, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'vahan-api.p.rapidapi.com'
            }
        });

        const data = response.data;
        return {
            registrationNumber: data.registration_number,
            ownerName: data.owner_name,
            model: data.model_name,
            fuelType: data.fuel_type,
            registrationDate: data.registration_date,
            engineNumber: data.engine_number,
            chassisNumber: data.chassis_number,
            insuranceExpiry: data.insurance_expiry_date
        };
    } catch (error) {
        console.error('VAHAN API verification failed:', error);
        return null; // Don't block the user, but log the failure
    }
};
