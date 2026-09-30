import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Counter-Offer | Hizaki Labs",
  description: "Negotiate your starting salary against a stingy AI Hiring Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        
        {/* Hizaki Labs Asset Management Links */}
        <link rel="icon" type="image/svg+xml" href="/images/icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/icon.png" />
        <link rel="mask-icon" href="/images/icon.svg" color="#6366f1" />
      </head>
      <body className="bg-hizaki-bgDarker text-hizaki-secondary font-inter antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}