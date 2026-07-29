import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";

export const metadata: Metadata = {
  title: "ITcareer",
  description: "Trang web tuyển dụng IT hàng đầu Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
