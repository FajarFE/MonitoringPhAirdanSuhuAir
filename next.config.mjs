/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"i.pinimg.com",
			"www.hyundai.com",
			"hyundaimobil.co.id",
			"localhost",
			"s7d1.scene7.com",
			"stat.overdrive.in",
			"www.pngkey.com",
			"images.unsplash.com",
			"sales-mobil.vercel.app",
		],
	},
	experimental: {
		missingSuspenseWithCSRBailout: false,
	},
};

export default nextConfig;
