import NextAuth, { type Session, type User } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import { generatePasswordHash, getUserFromDb } from "./credentials";
import { redirect } from "next/dist/server/api-utils";
import { loginUserSchema } from "@/types/signin";
import { isRedirectError } from "next/dist/client/components/redirect";
import { authConfig } from "@/auth.config";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.

			authorize: async (credentials) => {
				const parsedCredentials = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUserFromDb(email);
					if (!user) {
						return null;
						console.log(`ajg`);
					}
					const isPasswordValid = await bcrypt.compare(
						password,
						user.password as string
					);

					if (isPasswordValid) {
						return {
							name: user.name,
							email: user.email,
							emailVerifed: user.emailVerified,
						};
					}
					return {
						name: user.name,
						email: user.email,
						emailVerifed: user.emailVerified,
					};
				}
				console.log("Invalid credentials");
				return null;
				console.log(`ajg4`);
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, user }: { session: Session; user?: User }) {
			return { ...session };
		},
	},
	session: {
		strategy: "jwt",
	},
});
