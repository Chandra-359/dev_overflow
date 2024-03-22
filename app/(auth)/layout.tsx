import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <main className="flex min-h-screen w-full items-center justify-center">{children}</main>;
};

export default Layout;
