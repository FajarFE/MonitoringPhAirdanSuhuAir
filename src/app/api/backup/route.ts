"use server";

import { auth } from "@/libs/auth";
import prisma from "@/libs/db";
import { findUserByEmail } from "@/libs/email";
import pusher from "@/libs/pusher";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { phAir, suhuAir, dateTime } = await req.json();
	try {
		const user = await auth();
		if (!user?.user?.email) {
			throw new AuthError("Email not found in user data");
		}
		const userData = await findUserByEmail(user.user.email);

		if (!userData) {
			throw new Error("User data not found");
		}

		await pusher.trigger("monitoring-channel", "new-data", {
			phAir: phAir,
			suhuAir: suhuAir,
		});

		const date = new Date(dateTime);
		const options: Intl.DateTimeFormatOptions = {
			timeZone: "Asia/Jakarta",
			hour: "2-digit",
			hour12: false,
		};
		const currentHour = parseInt(
			date.toLocaleString("en-US", options).split(":")[0]
		);

		const specifiedTimes = [7, 12, 15, 18];

		if (specifiedTimes.includes(currentHour)) {
			const createData = await prisma.monitoring.create({
				data: {
					phAir: phAir,
					suhuAir: suhuAir,
					userId: userData.id,
					limitId: userData.limitId,
				},
			});

			// Send real-time update via Pusher

			return NextResponse.json({
				message: "Data berhasil dibuat dan dikirimkan secara real-time",
				data: createData,
			});
		} else {
			return NextResponse.json({
				message:
					"Data hanya dapat dimasukkan pada pukul 07:00, 12:00, 15:00, atau 18:00 WIB",
			});
		}
	} catch (err: any) {
		console.error(err.message, "Terjadi kesalahan");
		return NextResponse.json({ message: err.message });
	}
}
