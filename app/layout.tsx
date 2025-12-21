import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Hub",
  description: "Experience the artisan taste of Coffee Hub. Hand-picked beans roasted to perfection and delivered fresh to your cup.",
  keywords: "coffee, coffee hub, coffee beans, coffee shop, coffee delivery, coffee shop",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Coffee Hub",
    description: "Experience the artisan taste of Coffee Hub. Hand-picked beans roasted to perfection and delivered fresh to your cup.",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "Coffee Hub",
      },
    ],
    siteName: "Coffee Hub",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
