import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@components/common/QueryProvider";
import Gnb from "@components/layout/Gnb";
import Footer from "@components/layout/Footer";
import { Toaster } from "@components/ui/toaster";

export const metadata: Metadata = {
  title: "GLOWshop - 화장품 쇼핑몰",
  description: "당신의 피부를 위한 최고의 화장품을 만나보세요",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <Gnb />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
