import { TypeOf, z } from "zod";

export const createCarsBrands = z.object({
	name: z
		.string({ required_error: "Nama Belum Di Isi" })
		.min(1, "Nama is required"),
	logo: z
		.string({
			required_error: "Nama Belum Di Isi",
		})
		.min(1, "Nama is required"),
});

export type CarsBrandsSchema = TypeOf<typeof createCarsBrands>;
