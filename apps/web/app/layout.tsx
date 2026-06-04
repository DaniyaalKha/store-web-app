import type { Metadata } from "next";
import { cookies } from "next/headers";
import { use } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/use-auth";
import { CartProvider } from "@/lib/cart-context";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Daniyaal's Tech Store",
  description: "The store for premium computer components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Unwrap the Promise from cookies() using React.use()
  const cookieStore = use(cookies());
  const theme = cookieStore.get?.('theme-mode')?.value || 'dark';
  const themeClass = theme === 'light' ? '' : 'dark';

  return (
    <html lang="en" className={cn(themeClass, "font-sans", geist.variable)}>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
