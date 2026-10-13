import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartLink } from "@/components/cart/CartLink";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoply — Next.js interview practice",
  description: "A practice app for a Next.js frontend interview",
};

/**
 * The ROOT LAYOUT wraps every page. It renders once and stays mounted while
 * you navigate between pages (so state in here — like the cart — survives
 * navigation). `children` is whatever page.tsx matches the current URL.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <CartProvider>
          <header className="border-b border-zinc-200 bg-white">
            <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
              <Link href="/" className="font-semibold">
                Shoply
              </Link>
              <Link href="/products" className="text-sm text-zinc-600 hover:text-zinc-900">
                Products
              </Link>
              <Link href="/debug" className="text-sm text-zinc-600 hover:text-zinc-900">
                Debug lab
              </Link>
              <div className="ml-auto">
                <CartLink />
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
