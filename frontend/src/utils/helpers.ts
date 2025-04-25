import { format } from "date-fns";

/**
 * Format a date string to a user-friendly format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Mar 15, 2023")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
