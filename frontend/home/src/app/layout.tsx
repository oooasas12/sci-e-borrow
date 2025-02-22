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
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
