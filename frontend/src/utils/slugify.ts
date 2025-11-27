export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");
