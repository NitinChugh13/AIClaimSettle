import { pgTable, text, timestamp, integer, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const claims = pgTable('claims', {
    id: varchar('id', { length: 20 }).primaryKey(), // e.g. CLM-2024-88231
    policyNumber: varchar('policy_number', { length: 50 }).notNull(),
    vehicleReg: varchar('vehicle_reg', { length: 20 }).notNull(),
    holderName: varchar('holder_name', { length: 100 }).notNull(),
    vehicleModel: varchar('vehicle_model', { length: 100 }).notNull(),
    incidentType: varchar('incident_type', { length: 50 }).notNull(),
    incidentLocation: text('incident_location').notNull(),
    incidentDescription: text('incident_description'),
    incidentDate: varchar('incident_date', { length: 20 }),
    totalAmount: integer('total_amount').notNull(), // Final valid amount
    confidenceScore: integer('confidence_score').notNull(),
    fraudScore: integer('fraud_score').notNull(),
    flags: jsonb('flags').$type<string[]>(), // Array of flag strings
    status: varchar('status', { length: 30 }).notNull().default('pending'), // pending, approved, rejected, escalated, settled
    bankDetails: jsonb('bank_details'), // Store account details if provided
    settlementId: varchar('settlement_id', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const damageItems = pgTable('damage_items', {
    id: varchar('id', { length: 36 }).primaryKey(), // UUID typical
    claimId: varchar('claim_id', { length: 20 }).references(() => claims.id, { onDelete: 'cascade' }).notNull(),
    partName: varchar('part_name', { length: 100 }).notNull(),
    partLocation: varchar('part_location', { length: 50 }).notNull(),
    severity: varchar('severity', { length: 20 }).notNull(), // Minor, Moderate, Severe
    action: varchar('action', { length: 20 }).notNull(), // Repair, Replace
    confidence: integer('confidence'),
    oemPrice: integer('oem_price').default(0),
    laborCost: integer('labor_cost').default(0),
    depreciationRate: integer('depreciation_rate').default(0),
    depreciationAmount: integer('depreciation_amount').default(0),
    netSubtotal: integer('net_subtotal').notNull(),
});

export const claimsRelations = relations(claims, ({ many }) => ({
    damageItems: many(damageItems),
}));

export const damageItemsRelations = relations(damageItems, ({ one }) => ({
    claim: one(claims, {
        fields: [damageItems.claimId],
        references: [claims.id],
    }),
}));
