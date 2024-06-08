import { getUserFromDb } from "@/libs/credentials";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log(email, password);

    const user = await getUserFromDb(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );

    if (isPasswordValid) {
      return NextResponse.json({
        name: user.name,
        email: user.email,
        emailVerifed: user.emailVerified,
      });
    } else {
      return NextResponse.json({
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      return NextResponse.json({
        message: error.message,
      });
    }
    return NextResponse.json({
      message: "An unexpected error occurred. Please try again.",
    });
  }
}
