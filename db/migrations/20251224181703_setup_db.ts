import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Example: Create a 'user' table
    return knex.schema.createTable("user", (table) => {
        table.increments("id").primary().unique();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.boolean("verified").notNullable().defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user");
}
