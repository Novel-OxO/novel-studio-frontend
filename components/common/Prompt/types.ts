export interface PromptOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  defaultValue?: string;
}

export interface PromptContextValue {
  prompt: (options: PromptOptions) => Promise<string | null>;
}
