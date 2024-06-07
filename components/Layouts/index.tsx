"use server";

import { auth, signOut } from "@/libs/auth";
import prisma from "@/libs/db";
import DefaultLayout from "./DefaultLayout";
import { Contact } from "../contact";
import { CreateContact } from "../createContact";

export const Layout = async ({ children }: { children: React.ReactNode }) => {
	const user = await auth();

	const userData = await prisma.user.findFirst({
		where: { email: user?.user?.email as string },
		select: {
			name: true,
			image: true,
		},
	});

	const contactData = await prisma.myContact.findMany({
		select: { message: true, numberPhone: true, id: true },
	});

	return (
		<>
			<DefaultLayout
				childrenMain={children}
				children1={<CreateContact contact={contactData ?? []} />}
				image={userData?.image ?? "image"}
				children2={
					<form
						action={async (formData) => {
							"use server";
							await signOut();
						}}>
						<button type='submit'>Sign out</button>
					</form>
				}
				name={userData?.name ?? "Guest"}
			/>
		</>
	);
};
