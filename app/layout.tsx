import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: "KI - Steganografi",
  description: "Menyembunyikan pesan rahasia didalam teks rahasia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
