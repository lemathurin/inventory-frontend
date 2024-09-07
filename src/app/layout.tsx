import { ReactNode } from "react";
import { Metadata } from "next";
import localFont from "next/font/local";
import LogoutButton from "@/components/LogoutButton";
import ClientLogoutButton from "@/components/ClientLogoutButton";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Home Inventory App",
  description: "Manage your own household inventory with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLogoutButton />
        {children}
      </body>
    </html>
  );
}
