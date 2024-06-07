"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/libs/auth";
import { loginUserSchema } from "@/types/signin";
import prisma from "@/libs/db";
import { getUserFromDb } from "@/libs/credentials";
import { redirect } from "next/navigation";

interface LoginFormState {
	errors: {
		email?: string[];
		password?: string[];
		_form?: string[];
	};
	success?: boolean;
}

export async function login(
	formState: LoginFormState,
	formData: FormData
): Promise<LoginFormState> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const validatedFields = loginUserSchema.safeParse({
		email: email,
		password: password,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			success: false,
		};
	}

	return signIn("credentials", formData)
		.then(() => getUserFromDb(email))
		.then((user) => {
			if (!user) {
				return {
					errors: {
						_form: ["User not found"],
					},
					success: false,
				};
			}
			return {
				errors: {},
				success: true,
			};
		})
		.catch((error) => {
			console.log(error);
			if (error instanceof AuthError) {
				return {
					errors: {
						_form: [error.message],
					},
					success: false,
				};
			}
			return {
				errors: {
					_form: ["An unexpected error occurred. Please try again."],
				},
				success: false,
			};
		});
}
