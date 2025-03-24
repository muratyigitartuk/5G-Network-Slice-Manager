/**
 * Utility functions for data formatting
 * @module formatUtils
 */

/**
 * Formats a number as a file size with appropriate units
 * 
 * @param {number} bytes - The size in bytes
 * @param {number} [decimals=2] - Number of decimal places to display
 * @returns {string} Formatted file size with units (B, KB, MB, GB, TB)
 * 
 * @example
 * // Returns "1.00 KB"
 * formatFileSize(1024);
 * 
 * @example
 * // Returns "1.5 MB"
 * formatFileSize(1572864, 1);
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formats a timestamp in human-readable relative time
 * 
 * @param {string|number|Date} timestamp - The date/time to format
 * @returns {string} Human-readable relative time (e.g., "just now", "5 minutes ago")
 * 
 * @example
 * // Returns "just now" or "a few seconds ago"
 * formatRelativeTime(new Date());
 * 
 * @example
 * // Returns something like "2 hours ago"
 * formatRelativeTime(Date.now() - 7200000);
 */
export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

/**
 * Truncates a string to specified length with ellipsis
 * 
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=50] - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis if needed
 * 
 * @example
 * // Returns "This is a..."
 * truncateText("This is a long string", 10);
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}; 