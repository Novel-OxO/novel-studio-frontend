/**
 * Strip HTML tags from a string
 *
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 *
 * @example
 * ```ts
 * stripHtmlTags("<p>Hello <strong>World</strong></p>"); // "Hello World"
 * stripHtmlTags("<p>react</p>"); // "react"
 * ```
 */
export const stripHtmlTags = (html: string): string => {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;

  return textarea.value;
};
