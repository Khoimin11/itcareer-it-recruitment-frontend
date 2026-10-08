export const formatCityName = (name?: string | null): string => {
  return (name || "").trim().replace(/^Thành phố\s+/i, "");
};
