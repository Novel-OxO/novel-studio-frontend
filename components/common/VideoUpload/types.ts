export interface VideoUploadProps {
  value?: string | null; // Current video URL
  onChange: (url: string | null) => void; // Callback when video changes
  onDurationChange?: (duration: number) => void; // Callback when video duration is calculated (in seconds)
  onError?: (error: string) => void; // Callback when upload fails
  maxSizeInMB?: number; // Maximum file size in MB (default: 5GB = 5120MB)
  disabled?: boolean;
  className?: string;
}
