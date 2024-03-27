"use client";
import React from "react";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "@/components/ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 flex flex-wrap gap-3 max-md:hidden">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          // onCLick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === filter.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"}`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
