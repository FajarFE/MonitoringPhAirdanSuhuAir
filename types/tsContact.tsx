import { z } from "zod";

export const contactSchema = z.object({
	nomor: z.string().refine((val) => /^(\+62|62|0)8[1-9]\d{7,11}$/.test(val), {
		message:
			"Nomor telepon harus dimulai dengan +62 dan berisi 10 hingga 14 digit angka setelahnya.",
	}),
	pesan: z.string().min(1),
});
