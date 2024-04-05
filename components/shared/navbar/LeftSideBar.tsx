"use client";
import React from "react";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


const LeftSideBar = () => {
  const {userId} = useAuth()

  const NavContent = () => {
    const pathname = usePathname();
    return (
      <>
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

            // TODO -> profile/id
            if(item.route === "/profile") {
              if(userId){
                item.route = `/profile/${userId}`
              }else{
                return null
              }
            }

          return (
            <React.Fragment key={item.route}>
              <Link
                href={item.route}
                className={`${
                  isActive
                    ? "primary-gradient rounded-lg text-light-900"
                    : "text-dark300_light900"
                } flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p
                  className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
                >
                  {item.label}
                </p>
              </Link>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-6">
        <NavContent />
      </div>

      <div className="flex flex-col gap-3">
        <SignedOut>
          {/* <div className="flex flex-col gap-3"> */}
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="signin"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
          {/* </div> */}
        </SignedOut>
      </div>
    </>
  );
};

export default LeftSideBar;
