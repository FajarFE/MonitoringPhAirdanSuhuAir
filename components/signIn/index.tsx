"use client";

// Importing necessary dependencies
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { redirect, useSearchParams } from "next/navigation";
import { authenticate } from "@/libs/email";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Defining the Login Form Component

interface LoginForm {
	children: React.ReactNode;
}
export default function Form({ children }: LoginForm) {
	// Obtaining form state and action from useFormState hook
	const [formState, action] = useFormState(authenticate, "awdoikaodkoad");
	const { data: session } = useSession();
	// Handling email verification redirection
	// remember isUsersEmailVerified function in server action
	if (formState?.startsWith("EMAIL_NOT_VERIFIED")) {
		// extract the email
		redirect(`/email/verify/send?email=${formState.split(":")[1]}`);
	}

	console.log(session);
	const { pending } = useFormStatus();

	// Rendering the Login Form JSX content
	return (
		<div className='w-full h-screen grid grid-cols-12 bg-black relative'>
			<Image
				src='https://s7d1.scene7.com/is/image/hyundai/2024-ev-campaign-hp2-ext-1440-1919?wid=1919&qlt=85,0&fmt=webp'
				alt='anjay'
				width={2200}
				height={900}
				className='absolute bottom-0 w-[2200px]'
			/>

			<div className='col-span-8 relative flex w-full h-full justify-center items-center'></div>
			<form
				className='w-full h-full p-10 z-10 col-span-4 justify-center items-center flex'
				action={action}>
				<div className='flex justify-center items-center flex-col rounded-2xl w-full h-full bg-gray-50 pb-4 pt-8 gap-10 px-20'>
					<h1 className='mb-3 text-2xl'>Please log in to continue.</h1>
					<div className='w-full mb-4'>
						{/* Email Input Field */}
						<div>
							<label
								className='mb-3 mt-5 block text-xs font-medium text-gray-900'
								htmlFor='email'>
								Email
							</label>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500'
								id='email'
								type='email'
								name='email'
								placeholder='Enter your email address'
								required
							/>
						</div>
						{/* Password Input Field */}
						<div>
							<label
								className='mb-3 mt-5 block text-xs font-medium text-gray-900'
								htmlFor='password'>
								Password
							</label>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500'
								id='password'
								type='password'
								name='password'
								placeholder='Enter password'
								required
								minLength={6}
							/>
						</div>
						{/* Displaying form state error */}
						{formState && (
							<div className='text-sm text-red-500'>{formState}</div>
						)}
					</div>
					{/* Login Button */}
					<button
						type='submit'
						className='bg-gray-200 py-2 rounded w-full disabled:bg-slate-50 disabled:text-slate-500'
						disabled={pending ? true : false}>
						Login {pending ? "..." : ""}
					</button>
					{/* Link to Signup Page */}
					<div className='mt-4 text-center'>
						Don&apos;t have an account?&nbsp;
						<Link className='underline' href='/register'>
							Sign Up
						</Link>
					</div>
					{children}
				</div>
			</form>
		</div>
	);
}
