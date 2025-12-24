/**
 * User Interface representing a user in the database.
 */

export interface User {
    id: number;
    username: string;
    password: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}
