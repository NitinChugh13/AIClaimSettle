import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const INSURERS = ['SecureShield Insurance', 'PrimeCover General', 'BharatGuard Insurance'];

const VEHICLES = [
    { make: 'Maruti', model: 'Swift VXI', year: 2021, idv: 485000, type: 'Car' },
    { make: 'Hyundai', model: 'Creta SX', year: 2022, idv: 920000, type: 'Car' },
    { make: 'Honda', model: 'Activa 6G', year: 2023, idv: 68000, type: 'Two-Wheeler' },
    { make: 'Tata', model: 'Nexon XZ', year: 2021, idv: 780000, type: 'Car' },
    { make: 'Royal Enfield', model: 'Classic 350', year: 2020, idv: 145000, type: 'Two-Wheeler' },
    { make: 'Maruti', model: 'Baleno Delta', year: 2022, idv: 560000, type: 'Car' },
    { make: 'Hyundai', model: 'i20 Asta', year: 2021, idv: 640000, type: 'Car' },
    { make: 'Toyota', model: 'Fortuner', year: 2020, idv: 1850000, type: 'Car' },
    { make: 'Honda', model: 'City ZX', year: 2022, idv: 890000, type: 'Car' },
    { make: 'Bajaj', model: 'Pulsar NS200', year: 2021, idv: 95000, type: 'Two-Wheeler' },
    { make: 'Kia', model: 'Seltos HTK', year: 2022, idv: 1050000, type: 'Car' },
    { make: 'Mahindra', model: 'Thar LX', year: 2021, idv: 1250000, type: 'Car' },
    { make: 'Maruti', model: 'Ertiga ZXI', year: 2023, idv: 850000, type: 'Car' },
    { make: 'Hyundai', model: 'Venue S', year: 2020, idv: 620000, type: 'Car' },
    { make: 'Tata', model: 'Punch Adventure', year: 2022, idv: 580000, type: 'Car' },
    { make: 'Honda', model: 'Hornet 2.0', year: 2021, idv: 110000, type: 'Two-Wheeler' },
    { make: 'TVS', model: 'Jupiter 125', year: 2023, idv: 75000, type: 'Two-Wheeler' },
    { make: 'Yamaha', model: 'MT-15', year: 2022, idv: 155000, type: 'Two-Wheeler' },
    { make: 'Maruti', model: 'Dzire ZXI', year: 2021, idv: 620000, type: 'Car' },
    { make: 'Hyundai', model: 'Verna SX', year: 2022, idv: 1150000, type: 'Car' },
    { make: 'Skoda', model: 'Slavia Ambition', year: 2023, idv: 1280000, type: 'Car' },
    { make: 'Volkswagen', model: 'Taigun Topline', year: 2022, idv: 1450000, type: 'Car' },
    { make: 'MG', model: 'Hector Sharp', year: 2021, idv: 1480000, type: 'Car' },
    { make: 'Jeep', model: 'Compass Limited', year: 2020, idv: 1650000, type: 'Car' },
    { make: 'Mahindra', model: 'XUV700 AX5', year: 2022, idv: 1580000, type: 'Car' },
];

const HOLDERS = [
    { name: 'Rahul Sharma', email: 'rahul.s@example.com' },
    { name: 'Priya Patel', email: 'priya.p@example.com' },
    { name: 'Amit Kumar', email: 'amit.k@example.com' },
    { name: 'Sneha Gupta', email: 'sneha.g@example.com' },
    { name: 'Vikram Singh', email: 'vikram.s@example.com' },
    { name: 'Ananya Iyer', email: 'ananya.i@example.com' },
    { name: 'Rohan Mehta', email: 'rohan.m@example.com' },
    { name: 'Siddharth Rao', email: 'sid.r@example.com' },
    { name: 'Kavita Reddy', email: 'kavita.r@example.com' },
    { name: 'Arjun Verma', email: 'arjun.v@example.com' },
    { name: 'Neha Chawla', email: 'neha.c@example.com' },
    { name: 'Manish Malhotra', email: 'manish.m@example.com' },
    { name: 'Sonia Gandhi', email: 'sonia.g@example.com' },
    { name: 'Pankaj Tripathi', email: 'pankaj.t@example.com' },
    { name: 'Deepika Padukone', email: 'deepika.p@example.com' },
    { name: 'Ranbir Kapoor', email: 'ranbir.k@example.com' },
    { name: 'Virat Kohli', email: 'virat.k@example.com' },
    { name: 'MS Dhoni', email: 'ms.d@example.com' },
    { name: 'Sachin Tendulkar', email: 'sachin.t@example.com' },
    { name: 'Ratan Tata', email: 'ratan.t@example.com' },
    { name: 'Mukesh Ambani', email: 'mukesh.a@example.com' },
    { name: 'Arijit Singh', email: 'arijit.s@example.com' },
    { name: 'Alia Bhatt', email: 'alia.b@example.com' },
    { name: 'Ayushmann Khurrana', email: 'ayush.k@example.com' },
    { name: 'Irrfan Khan', email: 'irrfan.k@example.com' },
];

const STATES = ['MH', 'DL', 'KA', 'TN', 'GJ'];
const NCBS = [0, 20, 25, 35, 45, 50];

function generateVehicleNumber(state: string) {
    const district = Math.floor(Math.random() * 99) + 1;
    const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const number = Math.floor(Math.random() * 8999) + 1000;
    return `${state}${district.toString().padStart(2, '0')}${series}${number}`;
}

function calculateDepreciation(year: number) {
    const age = new Date().getFullYear() - year;
    if (age <= 1) return 0;
    if (age <= 2) return 5;
    if (age <= 3) return 10;
    if (age <= 5) return 15;
    return 20;
}

async function seed() {
    console.log('Starting seed process...');

    const policies = [];

    for (let i = 0; i < 25; i++) {
        const vehicle = VEHICLES[i];
        const holder = HOLDERS[i];
        const insurer = INSURERS[Math.floor(Math.random() * INSURERS.length)];
        const state = STATES[Math.floor(Math.random() * STATES.length)];

        const policy_number = `POL-${state}-2024-${(i + 142).toString().padStart(5, '0')}`;
        const vehicle_number = generateVehicleNumber(state);

        // Dates
        const startYear = Math.random() > 0.5 ? 2023 : 2024;
        const policy_start_date = new Date(startYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const policy_end_date = new Date(policy_start_date);
        policy_end_date.setFullYear(policy_end_date.getFullYear() + 1);

        policies.push({
            policy_number,
            holder_name: holder.name,
            holder_mobile: `${['6', '7', '8', '9'][Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 899999999) + 100000000}`,
            holder_email: holder.email,
            vehicle_number,
            vehicle_make: vehicle.make,
            vehicle_model: vehicle.model,
            vehicle_year: vehicle.year,
            vehicle_type: vehicle.type,
            vehicle_color: ['White', 'Silver', 'Grey', 'Black', 'Red', 'Blue'][Math.floor(Math.random() * 6)],
            insurer_name: insurer,
            policy_type: Math.random() > 0.4 ? 'Comprehensive' : 'Zero Dep',
            policy_start_date: policy_start_date.toISOString().split('T')[0],
            policy_end_date: policy_end_date.toISOString().split('T')[0],
            idv_value: vehicle.idv,
            premium_amount: Math.round(vehicle.idv * 0.03),
            own_damage_cover: true,
            third_party_cover: true,
            personal_accident_cover: true,
            zero_depreciation: Math.random() > 0.5,
            roadside_assistance: Math.random() > 0.3,
            engine_protection: Math.random() > 0.6,
            depreciation_rate: calculateDepreciation(vehicle.year),
            ncb_percentage: NCBS[Math.floor(Math.random() * NCBS.length)],
            previous_claims: Math.floor(Math.random() * 3),
            is_active: true,
        });
    }

    const { data, error } = await supabase
        .from('policies')
        .insert(policies);

    if (error) {
        console.error('Error seeding policies:', error);
    } else {
        console.log('Successfully seeded 25 policies!');
    }
}

seed();
