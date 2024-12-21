import React from "react";

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
  noPadding?: boolean;
}

const Layout = ({ children, header, noPadding }: Props) => {
  return (
    <>
        <div>aaaaaaaaaaaaa</div>
        <div >
          {children}
        </div>
    </>
  );
};

export default Layout;
