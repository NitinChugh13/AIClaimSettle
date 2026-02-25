const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    connect_timeout: 30,
});

async function migrate() {
    console.log('Running manual migration...');
    try {
        await sql`ALTER TABLE claims ADD COLUMN IF NOT EXISTS bank_details jsonb;`;
        await sql`ALTER TABLE claims ADD COLUMN IF NOT EXISTS settlement_id varchar(50);`;
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await sql.end();
    }
}

migrate();
