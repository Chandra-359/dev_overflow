"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface LocalSearchProps {
  route: string;
  iconPosition: string;
  iconSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  iconPosition,
  iconSrc,
  placeholder,
  otherClasses,
}: LocalSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(()=>{
    const delayDebounceFn = setTimeout(()=>{
      if(search){
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key:'q',
          value:search
        })

        // console.log(newUrl);
        // /?q=njknjmo
        router.push(newUrl, {scroll:false})
      }else{
        // console.log(route, pathname);
        let newUrl='/'
        if(route === pathname){
        
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys:['q']
        })
      }

        router.push(newUrl, {scroll:false})
      
      }
    },300)


    return () => clearTimeout(delayDebounceFn)

  },[search,router,pathname,query,searchParams,route])
  
  


  return (
    <div className="relative w-full">
      <div
        className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
      >
        {iconPosition === "left" && (
          <Image
            src={iconSrc}
            alt="Search Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}

        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {setSearch(e.target.value)}}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />

        {iconPosition === "right" && (
          <Image
            src={iconSrc}
            alt="Search Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSearch;
