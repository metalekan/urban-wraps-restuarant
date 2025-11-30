import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CartProvider } from "@/lib/contexts/CartContext";
import { OrderProvider } from "@/lib/contexts/OrderContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urban Wraps - Fresh Custom Wraps & Rolls",
  description: "Build your perfect meal with our wide selection of bases, proteins, veggies, and sauces.",
   icons: {
    icon: '/favicon.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <OrderProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </OrderProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
