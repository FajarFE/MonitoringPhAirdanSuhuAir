import { z } from "zod";

export const LimitationsSchema = z.object({
	name: z.string().min(3).max(255),
	maxPh: z.number(),
	minPh: z.number(),
	maxTemperature: z.number(),
	minTemperature: z.number(),
});
