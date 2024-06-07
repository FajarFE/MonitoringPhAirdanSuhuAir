// src/components/signup/form.tsx

// Ensuring client-side code
"use client";

// Importing necessary modules and components
import Link from "next/link";
import { signUp } from "@/actions/signup";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { useState } from "react";

interface dataIkan {
	id: string;
	name: string;
}

interface RegisterForm {
	children: React.ReactNode;
	data: dataIkan[];
}
export default function Form({ children, data }: RegisterForm) {
	const [selectedOption, setSelectedOption] = useState("");
	const [formState, action] = useFormState(signUp, {
		errors: {},
	});

	const { pending } = useFormStatus();

	return (
		<div className='w-full h-screen grid grid-cols-12 bg-black relative'>
			<Image
				src='https://s7d1.scene7.com/is/image/hyundai/2024-ev-campaign-hp2-ext-1440-1919?wid=1919&qlt=85,0&fmt=webp'
				alt='anjay'
				width={2200}
				height={900}
				className='absolute bottom-0 w-[2200px]'
			/>
			<form
				className='w-full h-full p-10 z-10 col-span-4 justify-center items-center flex'
				action={action}>
				<div className='flex flex-col gap-10 px-20 rounded-lg h-full w-full justify-center items-center bg-gray-50  pb-4 pt-8'>
					<h1 className='mb-3 text-2xl'>Sign Up Now!</h1>
					<div className='w-full mb-4'>
						<div>
							<label
								className='mb-3 mt-5 block text-xs font-medium text-gray-900'
								htmlFor='email'>
								Email
							</label>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500'
								placeholder='Enter your email'
								type='email'
								id='email'
								name='email'
								defaultValue=''
							/>
							{/* Displaying email errors if any */}
							{formState?.errors.email && (
								<div className='text-sm text-red-500'>
									{formState.errors.email.join(", ")}
								</div>
							)}
						</div>

						<div>
							<label
								className='mb-3 mt-5 block text-xs font-medium text-gray-900'
								htmlFor='password'>
								Password
							</label>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500'
								placeholder='Enter your password'
								type='password'
								id='password'
								name='password'
								defaultValue=''
							/>

							{formState?.errors.password && (
								<div className='text-sm text-red-500'>
									{formState.errors.password.join(", ")}
								</div>
							)}
						</div>

						<div>
							<label
								className='mb-3 mt-5 block text-xs font-medium text-gray-900'
								htmlFor='name'>
								Name
							</label>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500'
								placeholder='Enter your name'
								type='text'
								id='name'
								name='name'
								defaultValue=''
							/>
						</div>
						{/* Displaying name errors if any */}
						{formState?.errors.name && (
							<div className='text-sm text-red-500'>
								{formState.errors.name.join(", ")}
							</div>
						)}
					</div>
					<select
						id='limitId'
						name='limitId'
						value={selectedOption}
						onChange={(e) => setSelectedOption(e.target.value)}
						className='peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2'>
						<option value=''>Pilih Ikan</option>
						{data &&
							data.length > 0 &&
							data.map((item, index) => (
								<option key={index} value={item.id}>
									{item.name}
								</option>
							))}
					</select>
					<button
						className='bg-gray-200 py-2 rounded w-full disabled:bg-slate-50 disabled:text-slate-500'
						disabled={pending ? true : false}>
						{/* Displaying "Sign Up" or "Sign Up ..." based on the form status */}
						Sign Up {pending ? "..." : ""}
					</button>
					<div className='mt-4 text-center'>
						Already have an account?&nbsp;
						<Link className='underline' href='/login'>
							Login
						</Link>
					</div>
					{children}
				</div>
			</form>
			<div className='col-span-8 relative flex w-full h-full justify-center items-center'></div>
		</div>
	);
}
