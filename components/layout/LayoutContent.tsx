"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";

/**
 * LayoutContent Component
 *
 * Conditionally renders Header and Footer based on the current pathname.
 * Pages under /learn/[enrollmentId] (video learning page) will not show Header/Footer,
 * but /learn/[enrollmentId]/qna pages will show them.
 */
export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header/footer for video learning page only
  // Pattern: /learn/[enrollmentId] but NOT /learn/[enrollmentId]/qna
  const isVideoLearningPage =
    pathname?.startsWith("/learn/") &&
    !pathname?.includes("/qna") &&
    pathname?.split("/").length === 3; // /learn/[enrollmentId]

  if (isVideoLearningPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
