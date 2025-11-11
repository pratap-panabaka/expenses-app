import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import Navbar from "./ui/navbar";
import "./globals.css";

// Import Kanit font
const kanit = Kanit({
  subsets: ["latin"],
  variable: "--font-kanit",
  weight: ["300", "400", "500", "600", "700"], // optional: pick weights you’ll actually use
});

export const metadata: Metadata = {
  title: "PRATAP PANABAKA",
  description: "PRATAP PANABAKA Portfolio Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${kanit.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
