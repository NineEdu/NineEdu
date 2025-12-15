import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nine Education - Learn Anything, Anytime",
  description:
    "Empowering Lifelong Learning with Expert-Led Courses and Resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Toaster />
        <ToastContainer position="top-center" />
          <QueryProvider>{children} </QueryProvider>
      </body>
    </html>
  );
}
