export type ImageUploadVariant = "profile" | "thumbnail";

export interface ImageUploadProps {
  value?: string | null; // Current image URL
  onChange: (url: string | null) => void; // Callback when image changes
  onError?: (error: string) => void; // Callback when upload fails
  maxSizeInMB?: number; // Maximum file size in MB (default: 5MB)
  disabled?: boolean;
  className?: string;
  variant?: ImageUploadVariant; // Display style (default: "profile")
}
