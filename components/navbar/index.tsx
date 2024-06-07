"use client";
import { cn } from "@/libs/utils";
import Image from "next/image";
import { Link } from "react-scroll";

export interface DataNavbar {
	link: string;
	title: string;
}

interface navbarProps {
	className?: string;
	data: DataNavbar[];
	logo?: string;
	nama?: string;
}

export const Navbar = ({ className, data, logo, nama }: navbarProps) => {
	return (
		<>
			<div
				className={
					(cn(`flex justify-between items-center flex-row `), className)
				}>
				<div>
					{logo && (
						<Image
							src={logo}
							alt='Logo sales mobil'
							fill={true}
							width={40}
							height={40}
						/>
					)}
					<Link smooth={true} duration={500} offset={0} to='home'>
						{nama}
					</Link>
				</div>
				<div className='flex justify-center items-center gap-7'>
					{data &&
						data.map((data, index) => {
							return (
								<Link
									smooth={true}
									duration={500}
									offset={-150}
									to={data.link}
									key={index}
									className=''>
									{data.title}
								</Link>
							);
						})}
					<Link
						to='contact'
						smooth={true}
						offset={0}
						duration={500}
						className='px-4 py-3 bg-black rounded-full text-white'>
						Contact Sales
					</Link>
				</div>
			</div>
		</>
	);
};
