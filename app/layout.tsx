import type React from "react";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TaskMaster - Manage Your Tasks Efficiently",
    template: "%s | TaskMaster"
  },
  description: "A modern task management application to help you stay organized and productive",
  keywords: ["task manager", "productivity", "organization", "todo list", "project management"],
  authors: [{ name: "TaskMaster Team" }],
  creator: "TaskMaster",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}>
            {/* Skip to content link for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
            >
              Skip to content
            </a>
            
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            
            <Toaster 
              position="top-right"
              expand={false}
              richColors
              closeButton
              toastOptions={{
                duration: 5000,
                className: "toast-custom-class",
              }}
            />
        </body>
      </html>
    </ClerkProvider>
  );
}
