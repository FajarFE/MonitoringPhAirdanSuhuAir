import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface User {
	name: string | null;
	image: string | null;

	children1: React.ReactNode;
	children2: React.ReactNode;
}

const DropdownUser = ({ name, children1, children2, image }: User) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	console.log(image, "oawdkoado");
	const trigger = useRef<any>(null);
	const dropdown = useRef<any>(null);

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!dropdown.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setDropdownOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }: KeyboardEvent) => {
			if (!dropdownOpen || keyCode !== 27) return;
			setDropdownOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});

	return (
		<div className='relative'>
			<Link
				ref={trigger}
				onClick={() => setDropdownOpen(!dropdownOpen)}
				className='flex items-center gap-4'
				href='#'>
				<span className='hidden text-right lg:block'>
					<span className='block text-sm font-medium text-black dark:text-white'>
						{name}
					</span>
					<span className='block text-xs'>Admin</span>
				</span>

				<span className='w-full h-full flex justify-center items-center'>
					{image === "image" ? (
						<div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
							<Image
								src='https://www.pngkey.com/png/detail/21-213224_unknown-person-icon-png-download.png'
								alt={`uploaded Image`}
								width='200'
								height={100}
								className='rounded-lg w-full h-full object-cover'
							/>
						</div>
					) : (
						<Image
							width={112}
							height={112}
							src={"/images/user/user-01.png"}
							style={{
								width: "auto",
								height: "auto",
							}}
							alt='User'
						/>
					)}
				</span>
			</Link>

			{/* <!-- Dropdown Start --> */}
			<div
				ref={dropdown}
				onFocus={() => setDropdownOpen(true)}
				onBlur={() => setDropdownOpen(false)}
				className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
					dropdownOpen === true ? "block" : "hidden"
				}`}>
				<ul className='flex flex-col w-[200px] gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark'>
					<li>
						<Link
							href='/admin/profile'
							className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'>
							My Profile
						</Link>
					</li>
					<li>
						<Dialog>
							<DialogTrigger className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'>
								My Contacts
							</DialogTrigger>
							<DialogContent>{children1}</DialogContent>
						</Dialog>
					</li>
				</ul>
				<button className='flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'>
					{children2}
				</button>
			</div>
			{/* <!-- Dropdown End --> */}
		</div>
	);
};

export default DropdownUser;
