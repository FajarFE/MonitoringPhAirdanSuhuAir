"use server";
import { generatePasswordHash, getUserFromDb } from "@/libs/credentials";
import prisma from "@/libs/db";
import { sendVerificationEmail } from "@/libs/email";
import { signUpSchema } from "@/types/signup";
import { randomBytes } from "crypto";
import { User } from "next-auth";
import { redirect } from "next/navigation";

interface SignUpFormState {
	errors: {
		name?: string[];
		email?: string[];
		password?: string[];
		_form?: string[];
	};
}
const generateEmailVerificationToken = () => {
	// generates a buffer containing 32 random bytes.
	// The 32 indicates the number of bytes to generate, and it is commonly used
	// for creating secure tokens or identifiers.
	return randomBytes(32).toString("hex");
};

export async function signUp(
	formState: SignUpFormState,
	formData: FormData
): Promise<SignUpFormState> {
	// validate the sign up form
	const result = signUpSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		limitId: formData.get("limitId"),
	});

	// returns a validation error if the payload does not match our validation rules

	console.log(result?.data?.limitId);
	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	// make sure the user does not enter a registered email
	const isEmailExists = await getUserFromDb(result.data.email);

	if (isEmailExists) {
		return {
			errors: {
				email: ["Email already exists"],
			},
		};
	}

	const hashed = await generatePasswordHash(result.data.password);

	const verificationToken = generateEmailVerificationToken();

	try {
		// create user data
		const user = await prisma.user.create({
			data: {
				name: result.data.name,
				email: result.data.email,
				password: hashed,
				emailVerifToken: verificationToken,
				limitId: result.data.limitId,
			},
		});

		await sendVerificationEmail(result.data.email, verificationToken);

		// Redirecting to the email verification page
	} catch (error: unknown) {
		// Handling database creation errors
		console.log(error);
		if (error instanceof Error) {
			return {
				errors: {
					_form: [error.message],
				},
			};
		} else {
			return {
				errors: {
					_form: ["Something went wrong"],
				},
			};
		}
	} finally {
		redirect(
			`/email/verify/send?email=${result.data.email}&verification_sent=1`
		);
	}

	// Return an empty error object to indicate success

	return {
		errors: {},
	};
}
