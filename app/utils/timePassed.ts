import { DateTime } from 'luxon';

/**
 * Calculates the time passed since a given date and returns it in an appropriate unit
 * (seconds, minutes, hours, or days)
 * 
 * @param createdAt The timestamp or date object to calculate time since
 * @returns A string representing the time passed in the most appropriate unit
 */
export function timeSince(createdAt: string | Date): string {
  // Convert input to Luxon DateTime
  const createdAtDateTime = typeof createdAt === 'string' 
    ? DateTime.fromISO(createdAt) 
    : DateTime.fromJSDate(createdAt);
  
  // Get current time
  const now = DateTime.now();
  
  // Calculate the difference
  const diff = now.diff(createdAtDateTime, ['days', 'hours', 'minutes', 'seconds']);
  
  // Format based on the most significant unit
  if (diff.days >= 1) {
    return diff.days === 1 ? '1 day ago' : `${Math.floor(diff.days)} days ago`;
  } else if (diff.hours >= 1) {
    return diff.hours === 1 ? '1 hour ago' : `${Math.floor(diff.hours)} hours ago`;
  } else if (diff.minutes >= 1) {
    return diff.minutes === 1 ? '1 minute ago' : `${Math.floor(diff.minutes)} minutes ago`;
  } else {
    // Handle very small time differences (less than a minute)
    const seconds = Math.max(Math.floor(diff.seconds), 0);
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  }
}

/**
 * Alternative implementation with more detailed formatting options
 */
export function timeElapsed(createdAt: string | Date, options?: {
  abbreviated?: boolean,  // Use abbreviated units (e.g., "5h" instead of "5 hours")
  includeSeconds?: boolean, // Whether to show seconds for recent items
  threshold?: number,     // Threshold in days before displaying calendar date
}): string {
  const { abbreviated = false, includeSeconds = true, threshold = 7 } = options || {};
  
  // Convert input to Luxon DateTime
  const createdAtDateTime = typeof createdAt === 'string' 
    ? DateTime.fromISO(createdAt) 
    : DateTime.fromJSDate(createdAt);
  
  // Get current time
  const now = DateTime.now();
  
  // Calculate the difference
  const diff = now.diff(createdAtDateTime, ['days', 'hours', 'minutes', 'seconds']);
  
  // If more than threshold days, return calendar date
  if (diff.days > threshold) {
    return createdAtDateTime.toFormat('MMM d, yyyy');
  }
  
  // Format based on the most significant unit
  if (diff.days >= 1) {
    const days = Math.floor(diff.days);
    return abbreviated 
      ? `${days}d` 
      : `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } 
  
  if (diff.hours >= 1) {
    const hours = Math.floor(diff.hours);
    return abbreviated 
      ? `${hours}h` 
      : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } 
  
  if (diff.minutes >= 1) {
    const minutes = Math.floor(diff.minutes);
    return abbreviated 
      ? `${minutes}m` 
      : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } 
  
  // Only show seconds if includeSeconds is true
  if (includeSeconds) {
    const seconds = Math.max(Math.floor(diff.seconds), 0);
    return abbreviated 
      ? `${seconds}s` 
      : `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }
  
  // For very recent items when not showing seconds
  return abbreviated ? 'now' : 'just now';
}