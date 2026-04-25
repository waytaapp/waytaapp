import type { Metadata } from "next";
import { Inter, Spline_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const splineSans = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-spline-sans",
  display: "swap",
  // next/font only supports these weights for Spline Sans
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wayta",
  description: "Wayta nightlife order and pay",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
} as const;

const materialSymbolsHref =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${splineSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href={materialSymbolsHref} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
