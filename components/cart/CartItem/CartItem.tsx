"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format/price";
import type { CartItem as CartItemType } from "@/lib/api/cart/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (courseId: string) => void;
  isRemoving?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  isRemoving = false,
}) => {
  const { course } = item;

  return (
    <div className="bg-white rounded-lg border border-neutral-10 p-4 flex gap-4 hover:shadow-sm transition-shadow">
      {/* Thumbnail */}
      <Link href={`/courses/${course.id}`} className="shrink-0">
        <div className="relative w-40 aspect-video bg-neutral-5 rounded overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-40">
              <svg
                className="w-12 h-12"
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
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/courses/${course.id}`}
            className="hover:text-mint-50 transition-colors"
          >
            <h3 className="text-lg font-bold text-neutral-80 mb-1 truncate">
              {course.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-neutral-80">
            {formatPrice(course.price)}
          </div>

          <button
            onClick={() => onRemove(course.id)}
            disabled={isRemoving}
            className="text-neutral-60 cursor-pointer hover:text-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
