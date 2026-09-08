import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { getDatabase } from "@/db";
import * as authSchema from "@/db/auth-schema";

export const auth = betterAuth({
    appName: "SALMETEXMED",

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    database: drizzleAdapter(getDatabase(), {
        provider: "pg",
        schema: authSchema,
    }),

    emailAndPassword: {
        enabled: true,
        disableSignUp: true,
        minPasswordLength: 12,
        maxPasswordLength: 128,
    },

    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin"],
        }),
    ],
});