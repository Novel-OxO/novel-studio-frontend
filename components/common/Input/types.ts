import { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  id: string;
  error?: string;
  fullWidth?: boolean;
}
