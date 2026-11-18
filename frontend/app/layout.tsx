import type { Metadata } from "next";
import { Inter, Georama } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayoutWrapper } from '@/components/layouts/dashboard-layout-wrapper';
import localFont from 'next/font/local'

const inter = Inter({ subsets: ["latin"] });
const georama = localFont({ src: '../public/Georama_SemiExpanded-Regular.ttf' });

export const metadata: Metadata = {
  title: "OBF Automation",
  description: "Order-Booking-Form (OBF) Automation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
        <body className={`${georama.className} `}>
        <AuthProvider>
          <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
