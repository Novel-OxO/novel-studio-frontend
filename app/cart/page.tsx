"use client";

import Link from "next/link";
import { useCartItems } from "@/hooks/api/useCartItems";
import { useRemoveFromCart } from "@/hooks/api/useRemoveFromCart";
import { useConfirm } from "@/hooks/useConfirm";
import { CartItem } from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/utils/format/price";
import type { ApiErrorResponse } from "@/lib/api/common/types";

const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return typeof error === "object" && error !== null && "error" in error;
};

export default function CartPage() {
  const { data: cartItems = [], isLoading, error } = useCartItems();
  const removeFromCart = useRemoveFromCart();
  const { confirm } = useConfirm();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.course.price,
    0
  );

  const handleRemove = async (courseId: string) => {
    const confirmed = await confirm({
      title: "코스 삭제",
      message: "장바구니에서 이 코스를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
    });

    if (!confirmed) return;

    removeFromCart.mutate(courseId, {
      onError: (error) => {
        const errorMessage = isApiErrorResponse(error)
          ? error.error.message
          : "코스를 삭제하는 중 오류가 발생했습니다.";

        confirm({
          title: "오류",
          message: errorMessage,
          confirmText: "확인",
          cancelText: "",
          variant: "danger",
        });
      },
    });
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log("Proceed to checkout");
  };

  return (
    <div className="min-h-screen bg-neutral-1">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-80 mb-8">장바구니</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-neutral-10 p-4 h-32"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-10 border border-red-40 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-60 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-bold text-red-80 mb-2">
              장바구니를 불러오는 중 오류가 발생했습니다
            </h2>
            <p className="text-red-60 text-sm">잠시 후 다시 시도해주세요</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && cartItems.length === 0 && (
          <div className="bg-white rounded-lg border border-neutral-10 p-12 text-center">
            <svg
              className="w-20 h-20 text-neutral-40 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-xl font-bold text-neutral-60 mb-2">
              장바구니가 비어있습니다
            </h2>
            <p className="text-neutral-50 mb-6">
              관심있는 코스를 장바구니에 담아보세요
            </p>
            <Link
              href="/"
              className="inline-block bg-mint-50 hover:bg-mint-40 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              코스 둘러보기
            </Link>
          </div>
        )}

        {/* Cart Content */}
        {!isLoading && !error && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.courseId}
                  item={item}
                  onRemove={handleRemove}
                  isRemoving={removeFromCart.isPending}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-4">
                <div className="bg-white rounded-lg border border-neutral-10 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-neutral-80 mb-6">
                    주문 요약
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-neutral-60">
                      <span>코스 개수</span>
                      <span>{cartItems.length}개</span>
                    </div>
                    <div className="border-t border-neutral-10 pt-3">
                      <div className="flex justify-between text-xl font-bold text-neutral-80">
                        <span>총 금액</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="cursor-pointer w-full bg-mint-50 hover:bg-mint-40 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                  >
                    결제하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
