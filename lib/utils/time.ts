import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * Convert seconds to formatted duration string (HH:MM:SS or MM:SS)
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 *
 * @example
 * formatDuration(65) // "01:05"
 * formatDuration(3661) // "01:01:01"
 * formatDuration(0) // "00:00"
 */
export const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds || seconds === 0) {
    return "00:00";
  }

  const durationObj = dayjs.duration(seconds, "seconds");
  const hours = Math.floor(durationObj.asHours());
  const minutes = durationObj.minutes();
  const secs = durationObj.seconds();

  // If duration is less than 1 hour, show MM:SS
  if (hours === 0) {
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // If duration is 1 hour or more, show HH:MM:SS
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
