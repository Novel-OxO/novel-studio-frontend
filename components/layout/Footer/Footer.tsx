import clsx from "clsx";
import type { FooterProps } from "./types";

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={clsx(
        "bg-neutral-5 border-t border-neutral-10 mt-auto",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-neutral-50 text-center">
          © {currentYear} Novel Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
