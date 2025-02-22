"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { Providers } from '@/components/Providers';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ระบบครุภัณฑ์ | คณะวิทยาศาตร์และเทคโนโลยี</title>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
