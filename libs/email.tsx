"use server";

// Importing necessary modules and components
import { signIn, signOut } from "@/libs/auth";
import prisma from "@/libs/db";
import type { User } from "@prisma/client";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { EmailNotVerifiedError } from "./error";
import { Resend } from "resend";

// Authenticating function for sign-in
export async function authenticate(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		await isUsersEmailVerified(formData.get("email") as string);
		await signIn("credentials", formData);
	} catch (error) {
		// Handling authentication errors
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				default:
					return "Something went wrong.";
			}
		}

		// Handling email verification errors
		if (error instanceof EmailNotVerifiedError) {
			return error?.message;
		}

		// Throwing other unexpected errors
		throw error;
	}
}

// Defining the schema for sign-up form validation
const signUpSchema = z.object({
	name: z.string().min(3).max(255),
	email: z.string().email(),
	password: z.string().min(3).max(255),
});

// Interface for the sign-up form state
interface SignUpFormState {
	errors: {
		name?: string[];
		email?: string[];
		password?: string[];
		_form?: string[];
	};
}

// Sign-up function handling form validation and user creation
export async function signUp(
	formState: SignUpFormState,
	formData: FormData
): Promise<SignUpFormState> {
	// validate the sign up form
	const result = signUpSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	// returns a validation error if the payload does not match our validation rules
	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	// make sure the user does not enter a registered email
	const isEmailExists = await findUserByEmail(result.data.email);

	if (isEmailExists) {
		return {
			errors: {
				email: ["Email already exists"],
			},
		};
	}

	const hashed = await generatePasswordHash(result.data.password);

	const verificationToken = generateEmailVerificationToken();

	let user: User;
	try {
		// create user data
		user = await prisma.user.create({
			data: {
				name: result.data.name,
				email: result.data.email,
				password: hashed,
				emailVerifToken: verificationToken,
			},
		});
	} catch (error: unknown) {
		// Handling database creation errors
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
	}

	// Sending email verification
	await sendVerificationEmail(result.data.email, verificationToken);

	// Redirecting to the email verification page
	redirect(`/email/verify/send?email=${result.data.email}&verification_sent=1`);
}

// Function to handle user logout
export async function logout() {
	return await signOut();
}

// Function to find a user by email in the database
export const findUserByEmail = async (email: string) => {
	return await prisma.user.findFirst({
		where: {
			email,
		},
	});
};

// Function to generate a hashed password
const generatePasswordHash = async (password: string) => {
	// generates a random salt. A salt is a random value used in the hashing process to ensure
	// that even if two users have the same password, their hashed passwords will be different.
	// The 10 in the function call represents the cost factor, which determines how much
	// computational work is needed to compute the hash.
	const salt = await bcryptjs.genSalt(10);
	return bcryptjs.hash(password, salt);
};

// Function to generate an email verification token
const generateEmailVerificationToken = () => {
	// generates a buffer containing 32 random bytes.
	// The 32 indicates the number of bytes to generate, and it is commonly used
	// for creating secure tokens or identifiers.
	return randomBytes(32).toString("hex");
};

// Function to send a verification email
export const sendVerificationEmail = async (email: string, token: string) => {
	// nodemailer configuration. make sure to replace this with your native email provider in production.
	// we will use mailtrap in this tutorial, so make sure you have the correct configuration in your .env
	const baseUrl = process.env.BASE_URL || "http://localhost:3000";

	const resend = new Resend(process.env.RESEND_API);

	console.log(email);
	// the content of the email
	const emailData = {
		from: "Admin <admin@arfix-code.my.id>",
		to: email,
		subject: "Email Verification",
		html: `
        <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                background-color: #007BFF;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                line-height: 1.6;
            }
            .content p {
                margin: 0 0 10px;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Terima Kasih Sudah Mendaftar.Tolong Verifikasi Email:</p>
                <p><a href="${baseUrl}/email/verify?email=${email}&token=${token}" class="btn">Verify Email</a></p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
      `,
	};

	try {
		// send the email
		await resend.emails.send(emailData);
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
};

// Function to resend email verification
export const resendVerificationEmail = async (email: string) => {
	const emailVerificationToken = generateEmailVerificationToken();

	try {
		// update email verification token
		await prisma.user.update({
			where: { email },
			data: { emailVerifToken: emailVerificationToken },
		});

		// send the verification link along with the token
		await sendVerificationEmail(email, emailVerificationToken);
	} catch (error) {
		return "Something went wrong.";
	}

	return "Email verification sent.";
};

// Function to verify a user's email
export const verifyEmail = (email: string) => {
	return prisma.user.update({
		where: { email },
		data: {
			emailVerified: new Date(),
			emailVerifToken: null,
		},
	});
};

// Function to check if a user's email is verified
export const isUsersEmailVerified = async (email: string) => {
	const user = await prisma.user.findFirst({
		where: { email },
	});

	// if the user doesn't exist then it's none of the function's business
	if (!user) return true;

	// if the emailVerifiedAt value is null then raise the EmailNotVerifiedError error
	if (!user?.emailVerified)
		throw new EmailNotVerifiedError(`EMAIL_NOT_VERIFIED:${email}`);

	return true;
};
