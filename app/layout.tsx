import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Plot Twist - Turn Your Friends Into Comedy Writers",
  description: "A real-time multiplayer collaborative storytelling game where AI acts as a chaos agent to make stories hilariously unpredictable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
