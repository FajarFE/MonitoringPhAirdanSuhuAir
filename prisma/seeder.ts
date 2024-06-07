// Import Prisma Client
const { PrismaClient } = require("@prisma/client");

// Instantiate Prisma Client
const prisma = new PrismaClient();

async function seedLimitations() {
	try {
		// Create Limitation records
		await prisma.limitation.createMany({
			data: [
				{
					name: "Lele",
					maxPh: 7.5,
					minPh: 6.5,
					maxTemperature: 30,
					minTemperature: 25,
				},
				{
					name: "Gurame",
					maxPh: 7.0,
					minPh: 6.0,
					maxTemperature: 28,
					minTemperature: 24,
				},
				{
					name: "Arwana",
					maxPh: 7.2,
					minPh: 6.2,
					maxTemperature: 32,
					minTemperature: 27,
				},
			],
		});
		console.log("Limitation data seeded successfully.");
	} catch (error) {
		console.error("Error seeding Limitation data:", error);
	} finally {
		// Disconnect Prisma Client
		await prisma.$disconnect();
	}
}

// Call the seedLimitations function
await seedLimitations();
