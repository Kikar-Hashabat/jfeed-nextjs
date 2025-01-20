/**
 * Formats a timestamp into a human-readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatPublishDate(timestamp: number): string {
  const date = new Date(timestamp);

  // Options for date formatting
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Returns a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}

/**
 * Formats a date range
 * @param startTimestamp - Start date timestamp
 * @param endTimestamp - End date timestamp
 * @returns Formatted date range string
 */
export function formatDateRange(
  startTimestamp: number,
  endTimestamp: number
): string {
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);

  // If dates are in the same year, only show year once
  if (startDate.getFullYear() === endDate.getFullYear()) {
    const startOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return `${new Intl.DateTimeFormat("en-US", startOptions).format(
      startDate
    )} - ${formatter.format(endDate)}`;
  }

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

/**
 * Returns ISO format date string for meta tags
 * @param timestamp - Unix timestamp in milliseconds
 * @returns ISO format date string
 */
export function getISODate(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Returns a formatted time string (e.g., "3:30 PM")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string
 */
export function formatTime(timestamp: number): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(timestamp));
}

// only date and time 01.01.2022 12:00
export function formatDateAndTime(timestamp: number): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
