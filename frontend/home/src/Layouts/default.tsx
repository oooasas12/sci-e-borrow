import Sidebar from "@/components/layouts/sidebar";
import React from "react";

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
  noPadding?: boolean;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="flex lg:flex-row overflow-auto">
        <Sidebar />
        <div className=" w-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
