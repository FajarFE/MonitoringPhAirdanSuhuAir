import { auth, signIn } from "@/libs/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Toast from "@/components/toast/toast";
import Form from "@/components/signIn";
import { FaGoogle } from "react-icons/fa6";

export default async function SignIn() {
	return (
		<>
			<Form>
				<form
					className='w-full px-20 flex justify-center items-center h-auto '
					action={async () => {
						"use server";
						await signIn("google", { redirectTo: "/admin/product" });
					}}>
					<button
						className='bg-slate-400 w-full flex justify-between items-center py-4 px-5 flex-row mx-2 gap-2 rounded-lg text-white'
						type='submit'>
						<FaGoogle size={25} />
						<div>Signin with Google</div>
					</button>
				</form>
			</Form>
		</>
	);
}
