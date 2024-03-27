"use client";
import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

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
          value=""
          onChange={() => {}}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
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
