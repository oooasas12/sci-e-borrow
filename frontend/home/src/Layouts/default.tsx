
import Sidebar from "@/components/layouts/sidebar";
import React from "react";
import { Provider } from 'react-redux'
import { store } from '../store/store'  // ปรับ path ตามโครงสร้างโปรเจค
import Head from 'next/head'
interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
  noPadding?: boolean;
}

const Layout = ({ children }: Props) => {
  return (
    <html lang="th">
      <Head>
        <title>ระบบครุภัณฑ์ | คณะวิทยาศาตร์และเทคโนโลยี</title>
      </Head>
      <body>
        <Provider store={store}>
          <div className="flex lg:flex-row overflow-auto">
            <Sidebar />
            <div className=" w-full">
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
