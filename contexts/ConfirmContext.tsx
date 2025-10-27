"use client";

import { createContext, useState } from "react";
import { Confirm } from "@/components/common/Confirm/Confirm";
import type {
  ConfirmOptions,
  ConfirmContextValue,
} from "@/components/common/Confirm/types";

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined
);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: { message: "" },
    resolve: null,
  });

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    setConfirmState({
      isOpen: false,
      options: { message: "" },
      resolve: null,
    });
  };

  const handleCancel = () => {
    if (confirmState.resolve) {
      confirmState.resolve(false);
    }
    setConfirmState({
      isOpen: false,
      options: { message: "" },
      resolve: null,
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Confirm
        isOpen={confirmState.isOpen}
        {...confirmState.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
