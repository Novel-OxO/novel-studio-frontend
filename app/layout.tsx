import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { ConfirmProvider } from "@/contexts/ConfirmContext";
import { PromptProvider } from "@/contexts/PromptContext";

export const metadata: Metadata = {
  title: "Novel Studio",
  description: "Novel Studio Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Providers>
          <ConfirmProvider>
            <PromptProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </PromptProvider>
          </ConfirmProvider>
        </Providers>
      </body>
    </html>
  );
}
