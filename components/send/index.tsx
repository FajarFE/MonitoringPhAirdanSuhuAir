"use client";
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmail } from "@/libs/email";

export function Form() {
	const searchParams = useSearchParams();

	// Extracting email and verification_sent status from search parameters
	const email = searchParams.get("email") ?? "";
	const verificationSent = Boolean(searchParams.get("verification_sent"));

	// State untuk menyimpan waktu terakhir verifikasi dikirim ulang
	const [resendTime, setResendTime] = useState(
		localStorage.getItem("verificationResendTime")
			? parseInt(localStorage.getItem("verificationResendTime")!, 10)
			: 0
	);

	// State untuk menyimpan jumlah tekanan tombol verifikasi
	const [verificationCount, setVerificationCount] = useState(0);

	// State untuk menyimpan waktu tersisa sebelum dapat mengirim ulang verifikasi lagi
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const currentTime = new Date().getTime();
			const remainingTime = resendTime - currentTime;
			setCountdown(Math.max(0, Math.floor(remainingTime / 1000)));

			// Jika waktu habis dan sudah mencapai batas maksimum verifikasi, reset ke awal
			if (remainingTime <= 0 && verificationCount >= 5) {
				setVerificationCount(0);
				localStorage.removeItem("verificationResendTime");
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [resendTime, verificationCount]);

	const resendVerification = async () => {
		// Tambahkan 1 ke jumlah tekanan tombol verifikasi
		setVerificationCount((prevCount) => prevCount + 1);

		// Hitung waktu verifikasi berikutnya
		const nextResendTime = resendTime + (verificationCount + 1) * 300000; // Waktu verifikasi berikutnya adalah waktu sebelumnya ditambah dengan jumlah tekanan tombol dikalikan dengan 5 menit (300000 milidetik)
		setResendTime(nextResendTime);

		// Set waktu verifikasi berikutnya
		localStorage.setItem("verificationResendTime", nextResendTime.toString());

		// Kirim ulang verifikasi
		await resendVerificationEmail(email);
	};
	return (
		<>
			<div className='w-screen h-screen justify-center items-center flex flex-col gap-5 bg-slate-200 '>
				{/* Tampilkan countdown */}
				<div className='w-[600px] flex justify-between py-20 items-center flex-col h-[400px] gap-10 bg-white shadow-2xl rounded-lg'>
					{/* Tampilkan pesan jika verifikasi berhasil dikirim */}
					{!!verificationSent && (
						<div className='text-green-500 '>
							Tautan verifikasi telah dikirimkan ke email Anda.
						</div>
					)}

					{/* Rendering tombol verifikasi */}

					<div className='flex flex-col gap-2 justify-center items-center'>
						<div className='px-5'>
							<button
								className='bg-slate-600 px-3 py-2 rounded-md text-white'
								onClick={resendVerification}
								disabled={
									countdown > 0 || (verificationCount >= 5 && countdown <= 0)
								}>
								Kirim Ulang Verifikasi
							</button>
						</div>
						{countdown > 0 && (
							<>
								<div className='text-red-500'>Verifikasi Lagi Dalam Waktu</div>
								<div>{formatTime(countdown)}</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

function formatTime(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
		.toString()
		.padStart(2, "0")}`;
}
