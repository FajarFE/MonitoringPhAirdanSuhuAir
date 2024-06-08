"use server";
import prisma from "@/libs/db";
import { pusherServer } from "@/libs/pusher";
import { sendNotificationEmail } from "@/libs/sendEmail";
import { NextResponse } from "next/server";

let lastPusherMessageTime: Date | null = null;

const lastSentTimes: { [key: string]: Date | null } = {
  "7:00": null,
  "12:00": null,
  "15:00": null,
  "18:00": null,
};

export async function POST(req: Request) {
  try {
    const { phAir, suhuAir, dateTime, email } = await req.json();
    const userData = await prisma.user.findFirst({
      where: { email: email },
      include: {
        limitations: true,
      },
    });
    if (!userData) {
      throw new Error("User data not found");
    }
    const phAirString = String(phAir);
    const suhuAirString = String(suhuAir);
    const dateTimeString = String(dateTime);
    const now = new Date();
    if (
      !lastPusherMessageTime ||
      now.getTime() - lastPusherMessageTime.getTime() >= 30 * 60 * 1000
    ) {
      lastPusherMessageTime = now;
      pusherServer.trigger("monitoring-channel", "monitoring-message", {
        phAir: phAirString,
        suhuAir: suhuAirString,
        dateTime: dateTimeString,
      });
    }

    const date = new Date(dateTime);
    const specifiedTimes = ["7:00", "12:00", "15:00", "18:00"];
    const messageSentWithinWindow = (timeKey: string) => {
      const lastSentTime = lastSentTimes[timeKey];
      const now = new Date();
      return (
        lastSentTime && now.getTime() - lastSentTime.getTime() < 10 * 60 * 1000
      );
    };

    const isWithinWindow = specifiedTimes.some((timeKey) => {
      const [hour, minute] = timeKey.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 10);
      return date >= start && date <= end;
    });

    const timeKey = specifiedTimes.find((timeKey) => {
      const [hour, minute] = timeKey.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 10);
      return date >= start && date <= end;
    });

    if (isWithinWindow && timeKey && !messageSentWithinWindow(timeKey)) {
      const createData = await prisma.monitoring.create({
        data: {
          phAir: phAirString,
          suhuAir: suhuAirString,
          userId: userData.id,
          limitId: userData.limitId,
        },
      });
      lastSentTimes[timeKey] = new Date();
      let message;
      const botToken = "7317014123:AAEx1CTsxaAHRggUZ_fjiIII9AD2m0mgx0E";
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const chatId = "-4248237204";
      if (
        phAir > userData.limitations.maxPh ||
        (phAir < userData.limitations.minPh &&
          suhuAir > userData.limitations.maxTemperature) ||
        suhuAir < userData.limitations.minTemperature
      ) {
        message =
          `Peringatan kondisi air untuk Ikan ${userData.limitations.name}\n` +
          `ph Air: ${phAir}\n` +
          `Batas Ph: ${userData.limitations.minPh} - ${userData.limitations.maxPh}\n` +
          `Suhu Air: ${suhuAir}\n` +
          `Batas Suhu: ${userData.limitations.minTemperature} - ${userData.limitations.maxTemperature}`;
      } else if (phAir > userData.limitations.maxPh) {
        message =
          `Peringatan Ph Air Melebihi Batas untuk Ikan ${userData.limitations.name}\n` +
          `ph Air: ${phAir}\n` +
          `Maksimal Ph Air: ${userData.limitations.maxPh}`;
      } else if (phAir < userData.limitations.minPh) {
        message =
          `Peringatan Ph Air Kurang dari Batas untuk Ikan ${userData.limitations.name}\n` +
          `ph Air: ${phAir}\n` +
          `Minimal Ph Air: ${userData.limitations.minPh}`;
      } else if (suhuAir > userData.limitations.maxTemperature) {
        message =
          `Peringatan Suhu Air Melebihi Batas untuk Ikan ${userData.limitations.name}\n` +
          `Suhu Air: ${suhuAir}\n` +
          `Maksimal Suhu Air: ${userData.limitations.maxTemperature}`;
      } else if (suhuAir < userData.limitations.minTemperature) {
        message =
          `Peringatan Suhu Air Kurang dari Batas untuk Ikan ${userData.limitations.name}\n` +
          `Suhu Air: ${suhuAir}\n` +
          `Minimal Suhu Air: ${userData.limitations.minTemperature}`;
      }
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
      await sendNotificationEmail(email, message as string);
      return NextResponse.json({
        message: "Data berhasil dibuat dan dikirimkan secara real-time",
        data: createData,
      });
    } else {
      return NextResponse.json({
        message:
          "Data hanya dapat dimasukkan 1x Setiap pukul 07:00, 12:00, 15:00, atau 18:00 WIB",
      });
    }
  } catch (err: any) {
    console.error(err.message, "Terjadi kesalahan");
    return NextResponse.json({ message: err.message });
  }
}
