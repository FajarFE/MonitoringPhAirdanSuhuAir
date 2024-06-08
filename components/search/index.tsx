"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";

export const SearchComponent = () => {
  const [value, setValue] = useState(""); // Added useState

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (e: any) => {
    const newValue = e?.target.value;
    setValue(newValue);
    router.push(pathname + "?" + createQueryString("search", newValue));
  };

  return (
    <div className='w-full h-auto text-xl pr-[200px]'>
      <Input
        className='text-xl font-bold'
        onChange={handleSearch}
        placeholder='Cari Mobil Disini'
        value={value}
      />{" "}
      {/* Pass value and onChange */}
    </div>
  );
};
