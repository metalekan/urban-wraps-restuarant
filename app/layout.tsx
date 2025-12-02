import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CartProvider } from "@/lib/contexts/CartContext";
import { OrderProvider } from "@/lib/contexts/OrderContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";


const outfit = Outfit({
  variable: "--font-outfit",
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
        className={`${outfit.variable} font-outfit antialiased`}
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
