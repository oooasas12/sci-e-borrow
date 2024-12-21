import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";


export const metadata: Metadata = {
  title: "ระบบครุภัณฑ์ | คณะวิทยาศาตร์และเทคโนโลยี"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`myFonts antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
