"use server";

import { auth, signOut } from "@/libs/auth";
import prisma from "@/libs/db";
import DefaultLayout from "./DefaultLayout";


export const Layout = async ({ children }: { children: React.ReactNode }) => {
	const user = await auth();

	const userData = await prisma.user.findFirst({
		where: { email: user?.user?.email as string },
		select: {
			name: true,
			image: true,
		},
	});



	return (
		<>
			<DefaultLayout
				childrenMain={children}
			
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
