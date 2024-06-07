"use client";

import { findUserByEmail, verifyEmail } from "@/libs/email";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export function VerifyEmail() {
	const searchParams = useSearchParams();

	const email = searchParams.get("email");
	const token = searchParams.get("token");

	const [isLoading, setIsLoading] = useState(true);
	const [result, setResult] = useState("Error verifying your email");

	useEffect(() => {
		const emailVerification = async () => {
			try {
				// Checking if required fields are present
				if (!email || !token) {
					throw new Error("Missing required fields");
				}

				// Finding user by email in the database
				const user = await findUserByEmail(email);
				if (!user) {
					throw new Error("Invalid verification token");
				}

				// Validating the verification token
				if (token !== user.emailVerifToken) {
					throw new Error("Invalid verification token");
				}

				// Updating user verification status in the database
				await verifyEmail(user.email);

				// Updating result message and indicating loading completion
				setResult("Email verified successfully. Please relogin.");
				redirect(`/login`);
				setIsLoading(false);
			} catch (error) {
				console.error("Error verifying email:", error);
			}
		};
		emailVerification();
	}, [email, token]);

	return (
		<>
			<div className='mb-4'>{isLoading ? "Please wait ..." : result}</div>

			<div className='my-3'>
				<Link href='/login' className='bg-white py-3 px-2 rounded'>
					Back to Login
				</Link>
			</div>
		</>
	);
}
