import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(3, "Minimal 3 Huruf").max(100, "Maksimal 255 Huruf"),
	image: z.string().min(1),
});
