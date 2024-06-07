"use client";
import { useToast } from "../ui/use-toast";

export default function Toast({
	title,
	description,
	variant = "destructive",
}: {
	title: string;
	description: string;
	variant: "default" | "destructive" | null | undefined;
}) {
	const { toast } = useToast();
	toast({
		title: title,
		description: description,
		variant: variant,
	});
}
