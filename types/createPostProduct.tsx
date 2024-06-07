import { error } from "console";
import { z } from "zod";
export const PostProductSchema = z.object({
	title: z.string().min(1, "Isi Title"),
	desc: z.string().min(1, "Isi Deskripsi"),
	price: z.string().min(1, "Isi Price"),
	status: z.string().min(1, "Isi Status"),
	carBrandId: z.string().min(1, "Isi Category Brand"),
	exterior: z.string().array().nonempty({ message: "Masukan Gambar" }),
	interior: z.string().array().nonempty({ message: "Masukan Gambar" }),
	safety: z.string().array().nonempty({ message: "Masukan Gambar" }),
	performance: z.string().array().nonempty({ message: "Masukan Gambar" }),
	technology: z.string().array().nonempty({ message: "Masukan Gambar" }),
});
export const PostProductFrontSchema = z.object({
	title: z.string().min(1, "Isi Title"),
	desc: z.string().min(1, "Isi Deskripsi"),
	image: z.string().min(1, "Isi Gambar"),
	price: z.string().min(1, "Isi Price"),
	status: z.string().min(1, "Isi Status"),
	carBrandId: z.string().optional(),
	exterior: z.array(z.string()),
	interior: z.array(z.string()),
	safety: z.array(z.string()),
	performance: z.array(z.string()),
	technology: z.array(z.string()),
});
