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

export default async function Home({
	searchParams,
}: {
	searchParams?: {
		search?: string;
	};
}) {
	const query = searchParams?.search || "";

	const DataNavbar = [
		{ link: "/#product", title: "Cars" },
		{ link: "/#testimoni", title: "Testimoni" },
		{ link: "/#solution", title: "Solusi" },
	];
	return (
		<div className='w-full h-auto '>
			<CarData search={query}>
				<NavbarAnother
					nama='Honda Tulungagung'
					className=' w-full mx-auto flex max-w-8xl container justify-between items-center py-5 text-lg font-bold'
					data={DataNavbar}
				/>
			</CarData>
		</div>
	);
}
