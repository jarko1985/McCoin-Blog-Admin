import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "McCoin Admin",
    template: "%s | McCoin Admin",
  },
  description: "Publish and manage McCoin blog content with a polished authoring experience.",
  icons: {
    icon: "/images/logo.svg",
    shortcut: "/images/logo.svg",
  },
  openGraph: {
    title: "McCoin Admin",
    description: "Publish elegant crypto articles with a delightful, fast authoring experience.",
    images: [
      { url: "/images/logo.svg" },
    ],
  },
  twitter: {
    card: "summary",
    title: "McCoin Admin",
    description: "Publish elegant crypto articles with a delightful, fast authoring experience.",
    images: ["/images/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
