"use server";
import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import type { PostProduct } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
interface PostFormState {
	message: string;
}

export async function deletePost(id: string): Promise<PostFormState> {
	try {
		const post = await prisma.postProduct.delete({
			where: { id },
		});
	} catch (error: unknown) {
		console.log(error);
	}
	revalidatePath("/admin/product");
	redirect("/admin/product");
}
