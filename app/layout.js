import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { CartProvider } from "@/components/CartContext";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata = {
  title: "PayGateway Learning Lab — Stripe & Razorpay Payment System",
  description:
    "Learn how payment gateways work with interactive Stripe and Razorpay integrations, payment tracking, subscriptions, and invoice generation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            <div className="app-layout">
              <Sidebar />
              <main className="main-content">{children}</main>
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
