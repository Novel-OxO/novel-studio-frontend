import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConfirmProvider } from "@/contexts/ConfirmContext";
import { PromptProvider } from "@/contexts/PromptContext";
import { LayoutContent } from "@/components/layout/LayoutContent";

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
              <LayoutContent>{children}</LayoutContent>
            </PromptProvider>
          </ConfirmProvider>
        </Providers>
      </body>
    </html>
  );
}
