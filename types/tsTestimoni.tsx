import { z } from "zod";

export const TestimonialsSchema = z.object({
	customer: z.string().min(1, "Masukan Nama Customer"),
	image: z.string().min(1, "Masukan Gambar Customer"),
	testimoni: z
		.string()
		.min(1, "Masukan Kata Kata Testimoni")
		.max(400, "Kata Kata Tidak Boleh Lebih Dari 400 Huruf"),
	status: z.string().min(1, "Masukan Status"),
	carBrandId: z.string().min(1, "Masukan Brand Id"),
});
