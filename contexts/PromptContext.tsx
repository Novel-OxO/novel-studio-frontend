"use client";

import { createContext, useState } from "react";
import { Prompt } from "@/components/common/Prompt/Prompt";
import type {
  PromptOptions,
  PromptContextValue,
} from "@/components/common/Prompt/types";

export const PromptContext = createContext<PromptContextValue | undefined>(
  undefined
);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [promptState, setPromptState] = useState<{
    isOpen: boolean;
    options: PromptOptions;
    resolve: ((value: string | null) => void) | null;
  }>({
    isOpen: false,
    options: { message: "" },
    resolve: null,
  });

  const prompt = (options: PromptOptions): Promise<string | null> => {
    return new Promise<string | null>((resolve) => {
      setPromptState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = (value: string) => {
    if (promptState.resolve) {
      promptState.resolve(value);
    }
    setPromptState({
      isOpen: false,
      options: { message: "" },
      resolve: null,
    });
  };

  const handleCancel = () => {
    if (promptState.resolve) {
      promptState.resolve(null);
    }
    setPromptState({
      isOpen: false,
      options: { message: "" },
      resolve: null,
    });
  };

  return (
    <PromptContext.Provider value={{ prompt }}>
      {children}
      <Prompt
        isOpen={promptState.isOpen}
        {...promptState.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </PromptContext.Provider>
  );
};
