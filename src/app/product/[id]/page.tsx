"use server";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SliderTestimoni from "@/components/sliderTestimoni";
import { ProductSection } from "@/components/productSection";
import { CarsView } from "@/components/carsView";
import { PinContainer } from "@/components/Pin";
import { HeroSection } from "@/components/heroSection";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Element } from "react-scroll";
import { title } from "process";
import LandingPage from "@/components/LandingPage";
import prisma from "@/libs/db";
import { Status } from "@prisma/client";
import { CarData } from "@/components/Car";
import { Navbar } from "@/components/navbar";
import { NavbarAnother } from "@/components/navbarOtherPage";
import { DetailProduct } from "@/components/detailProduct";

import { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const baseUrl = process.env.BASE_URL || "http://localhost:3000";

	const id = params.id;

	// fetch data
	const product = await prisma.postProduct.findFirst({
		where: { id: id },
		include: {
			user: { select: { name: true } },
			carBrand: { select: { name: true, logo: true } },
		},
	});

	// Check if product exists
	if (!product) {
		throw new Error("Product not found");
	}

	// Combine all image arrays into one
	const allImages = [
		...product.performance,
		...product.safety,
		...product.technology,
		...product.interiorImage,
		...product.exteriorImage,
		product.image,
	];

	// Construct title
	let title = product.title;
	if (product.carBrand) {
		title = `${product.carBrand.name} - ${product.title}`;
	}

	// Construct description
	const description = product.description;

	// Construct image URLs
	const images = allImages.map((image) => `${baseUrl}/images/${image}`);
	const openGraphImages = [...images];
	return {
		title: title,
		description: description,
		openGraph: {
			images: openGraphImages,
		},
	};
}

export default async function Home({ params }: { params: { id: string } }) {
	const DataNavbar = [
		{ link: "/#product", title: "Cars" },
		{ link: "/#testimoni", title: "Testimoni" },
		{ link: "/#solution", title: "Solusi" },
	];
	const product = await prisma.postProduct.findFirst({
		where: { id: params.id },
		select: {
			price: true,
			title: true,
			image: true,
			description: true,
			performance: true,
			exteriorImage: true,
			interiorImage: true,
			technology: true,
			safety: true,
			carBrand: { select: { name: true } },
		},
	});
	return (
		<div className='w-full h-auto '>
			<DetailProduct className='' data={product && product}>
				<NavbarAnother
					nama='Honda Tulungagung'
					className=' w-full mx-auto flex max-w-8xl container justify-between items-center py-5 text-lg font-bold'
					data={DataNavbar}
				/>
			</DetailProduct>
		</div>
	);
}
