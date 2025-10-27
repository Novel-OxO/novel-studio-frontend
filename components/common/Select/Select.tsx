"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import type { SelectProps } from "./types";

/**
 * 커스텀 Select 컴포넌트
 *
 * 네이티브 select 태그를 대체하는 커스텀 드롭다운 컴포넌트
 *
 * @example
 * ```tsx
 * <Select
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   options={[
 *     { value: "option1", label: "옵션 1" },
 *     { value: "option2", label: "옵션 2" }
 *   ]}
 *   placeholder="옵션을 선택하세요"
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  disabled = false,
  className = "",
  name,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      {/* Hidden native select for form compatibility */}
      <select
        name={name}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="hidden"
        tabIndex={-1}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom select trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          "w-full px-3 py-2 text-left bg-white border rounded-lg",
          "focus:outline-none",
          "flex items-center justify-between",
          disabled
            ? "bg-neutral-95 text-neutral-40 cursor-not-allowed"
            : "border-neutral-80 hover:border-neutral-60 cursor-pointer"
        )}
      >
        <span
          className={clsx(
            selectedOption ? "text-neutral-95" : "text-neutral-50"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={clsx(
            "w-4 h-4 transition-transform text-neutral-50",
            isOpen && "transform rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-80 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={clsx(
                "w-full px-3 py-2 text-left transition-colors hover:bg-neutral-5 cursor-pointer",
                option.value === value && "bg-neutral-5"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
