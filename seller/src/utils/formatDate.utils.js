export const formatSmartDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  if (isNaN(date)) return "--";

  const now = new Date();
  const diffMs = now - date;
  const dayMs = 24 * 60 * 60 * 1000;

  if (diffMs < 0) {
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  }

  if (diffMs < dayMs) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (diffMs < 7 * dayMs) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
};
