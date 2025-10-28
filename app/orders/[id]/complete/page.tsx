"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderCompletePage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <div className="min-h-screen bg-neutral-1 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg border border-neutral-10 p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-mint-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-mint-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-neutral-80 mb-4">
            결제가 완료되었습니다!
          </h1>

          {/* Message */}
          <p className="text-neutral-60 mb-2">
            주문번호: <span className="font-mono text-neutral-80">{orderId}</span>
          </p>
          <p className="text-neutral-60 mb-8">
            구매하신 코스를 지금 바로 수강하실 수 있습니다.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/my-courses"
              className="inline-block bg-mint-50 hover:bg-mint-40 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              내 코스 보기
            </Link>
            <Link
              href="/"
              className="inline-block bg-white hover:bg-neutral-3 text-neutral-80 font-bold py-3 px-6 rounded-lg border border-neutral-10 transition-colors"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
