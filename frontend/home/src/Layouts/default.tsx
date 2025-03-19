import Sidebar from "@/components/layouts/sidebar";
import Navbar from "@/components/layouts/navbar";
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
          <div className="flex flex-col lg:flex-row gap-10  overflow-auto">
            {/* แสดง Sidebar เฉพาะบนหน้าจอขนาด lg หรือใหญ่กว่า */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            
            {/* แสดง Navbar เฉพาะบนหน้าจอที่เล็กกว่า md */}
            <div className="block lg:hidden">
              <Navbar />
            </div>
            
            <div className="w-full">
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
