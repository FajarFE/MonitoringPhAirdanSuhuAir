import { TypeOf, object, string } from "zod";

export const loginUserSchema = object({
	email: string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email or password"),
	password: string({ required_error: "Password is required" }).min(
		1,
		"Password is required"
	),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
