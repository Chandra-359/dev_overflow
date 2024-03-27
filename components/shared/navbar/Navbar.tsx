import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      {/* Link for the logo */}
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="DevOverFlow"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          DEV<span className="text-primary-500">Overflow</span>
        </p>
      </Link>

      {/* component for the search area */}
      <GlobalSearch/>

      <div className="flex-between gap-5">
        {/* component for the dark mode to light mode switching */}
        <Theme/>
        {/* imported component from clerk for checking the status of the user */}
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        {/* nav component from the Mobile View file, it is sm:hidden class is given inside the sheet trigger component */}
        <MobileNav />

      </div>
    </nav>
  );
};

export default Navbar;
