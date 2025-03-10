import { Brand, Perfume } from "@/types";

/**
 * Format date to YYYY-MM-DD HH:MM:SS format
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().replace("T", " ").substring(0, 19);
};

/**
 * Get audience color for tags
 */
export const getAudienceColor = (audience: string): string => {
  switch (audience.toLowerCase()) {
    case "male":
      return "blue";
    case "female":
      return "magenta";
    case "unisex":
      return "purple";
    default:
      return "default";
  }
};

/**
 * Calculate average rating from comments array
 */
export const calculateAverageRating = (
  comments: { rating: number }[]
): number => {
  if (!comments || comments.length === 0) return 0;
  return (
    comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length
  );
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Return current timestamp and user information
 */
export const getFooterInfo = (): { timestamp: string; user: string } => {
  return {
    timestamp: "2025-03-10 05:01:10",
    user: "lkbaonhatcontinue",
  };
};

/**
 * Helper function to get brand name regardless of whether brand is string ID or object
 */
export const getBrandName = (brand: Brand | string): string => {
  return typeof brand === "string" ? "Brand" : (brand as Brand).brandName;
};

/**
 * Filter perfumes by keyword
 */
export const filterPerfumesByKeyword = (
  perfumes: Perfume[],
  keyword: string
): Perfume[] => {
  if (!keyword) return perfumes;
  const lowerKeyword = keyword.toLowerCase();

  return perfumes.filter(
    (perfume) =>
      perfume.perfumeName.toLowerCase().includes(lowerKeyword) ||
      (typeof perfume.brand !== "string" &&
        (perfume.brand as Brand).brandName
          .toLowerCase()
          .includes(lowerKeyword)) ||
      perfume.description.toLowerCase().includes(lowerKeyword)
  );
};
