import { MetadataRoute } from "next";
import prisma from "@/libs/db";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.BASE_URL || "http://localhost:3000";

	// Fetch all products from the database
	const products = await prisma.postProduct.findMany({
		select: {
			id: true,
			updatedAt: true,
		},
	});

	// Map the products to the format required by MetadataRoute.Sitemap
	const sitemapEntries = products.map((product) => ({
		url: `${baseUrl}/product/${product.id}`,
		lastModified: product.updatedAt,
	}));

	return sitemapEntries;
}
