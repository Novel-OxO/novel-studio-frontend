"use client";

import Image from "next/image";

interface CourseThumbnailProps {
  thumbnailUrl: string | null;
  title: string;
}

export const CourseThumbnail: React.FC<CourseThumbnailProps> = ({
  thumbnailUrl,
  title,
}) => {
  return (
    <div className="relative w-full aspect-video bg-neutral-5 rounded-lg overflow-hidden">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-40">
          <svg
            className="w-24 h-24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
