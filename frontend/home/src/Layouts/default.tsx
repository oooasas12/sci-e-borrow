import Sidebar from "@/components/layouts/sidebar";
import Navbar from "@/components/layouts/navbar";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store"; // ปรับ path ตามโครงสร้างโปรเจค
import Head from "next/head";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
          <div className="flex flex-col gap-10 overflow-auto lg:flex-row">
            {/* แสดง Sidebar เฉพาะบนหน้าจอขนาด lg หรือใหญ่กว่า */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* แสดง Navbar เฉพาะบนหน้าจอที่เล็กกว่า md */}
            <div className="block lg:hidden">
              <Navbar />
            </div>

            <div className="w-full">
              <button
                onClick={() => window.history.back()}
                className="mx-8 lg:mt-8 flex items-center gap-2 rounded-md bg-primary_1 px-4 py-2 text-white"
              >
                <IoIosArrowBack />
                <span>กลับ</span>
              </button>
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
