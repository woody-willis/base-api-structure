import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user").del();

    // Example entries
    await knex("user").insert([
        { id: 1, username: "John", password: "pass1" },
        { id: 2, username: "Jane", password: "pass2" },
        { id: 3, username: "Jim", password: "pass3" },
    ]);
}
