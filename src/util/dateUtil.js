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

export const formatMessageTimestamp = (timestamp) => {
  const date = parseDate(timestamp);
  return `${formatFullDate(date)}, ${formatTime(date)}`;
};

export const formatLastSeen = (timestamp) => {
  const date = parseDate(timestamp * 1000);
  const now = new Date();

  const timeDifference = now - date;
  const minutesAgo = Math.floor(timeDifference / (1000 * 60));

  if (minutesAgo === 0) {
    return `Last seen few seconds ago`;
  }

  if (minutesAgo < 60) {
    return `Last seen ${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  }

  if (isToday(date)) {
    return `Last seen today at ${formatTime(date)}`;
  }

  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (daysAgo === 1) {
    return `Last seen yesterday at ${formatTime(date)}`;
  } else if (daysAgo < 7) {
    return `Last seen on ${getDayOfWeek(date)} at ${formatTime(date)}`;
  }

  return `Last seen on ${formatFullDate(date)}, ${date.getFullYear()}`;
};
