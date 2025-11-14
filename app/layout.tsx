import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import Providers from "@/app/providers";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  variable: "--font-kanit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Expenses App",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
