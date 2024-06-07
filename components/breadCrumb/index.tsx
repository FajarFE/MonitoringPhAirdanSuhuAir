import { Divide } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineNavigateNext } from "react-icons/md";

export const BreadCrumbs = () => {
	const pathname = usePathname();
	const pathArray = pathname.split("/").filter(Boolean);

	return (
		<div className='w-full h-auto  flex flex-wrap uppercase gap-2 text-lg font-semibold py-5'>
			{pathArray.map((data, index) => {
				const href = "/" + pathArray.slice(0, index + 1).join("/");
				return (
					<div
						className='flex flex-row justify-center items-center gap-2'
						key={index}>
						<Link
							className={`${
								index === 0
									? "text-slate-400 pointer-events-none"
									: "text-slate-700  "
							}`}
							href={href}>
							{data}
						</Link>
						{index < pathArray.length - 1 && <MdOutlineNavigateNext />}
					</div>
				);
			})}
		</div>
	);
};
