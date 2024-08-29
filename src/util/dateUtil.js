export const parseDate = (timestamp) => {
  return new Date(timestamp);
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getDayOfWeek = (date) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const formatFullDate = (date) => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
};

export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatMessageDate = (date) => {
  if (isToday(date)) {
    return "Today";
  }
  const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  if (daysAgo < 7) {
    return getDayOfWeek(date);
  }
  return formatFullDate(date);
};
