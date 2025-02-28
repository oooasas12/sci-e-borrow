"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { Provider } from 'react-redux';
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { configureStore } from '@reduxjs/toolkit';
import { Providers } from '@/app/providers';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
