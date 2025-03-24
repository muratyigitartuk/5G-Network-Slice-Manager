import { formatFileSize, formatRelativeTime, truncateText } from '../formatUtils';

describe('formatFileSize', () => {
  test('formats 0 bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  test('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  test('formats kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(2048, 0)).toBe('2 KB');
  });

  test('formats megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(2097152, 0)).toBe('2 MB');
  });

  test('handles custom decimal places', () => {
    expect(formatFileSize(1536, 1)).toBe('1.5 KB');
    expect(formatFileSize(1536, 0)).toBe('2 KB');
  });
});

describe('formatRelativeTime', () => {
  // Mock the Date object
  const realDate = Date;
  const mockDate = new Date('2023-03-15T12:00:00Z');
  
  beforeEach(() => {
    global.Date = class extends Date {
      constructor() {
        return mockDate;
      }
      static now() {
        return mockDate.getTime();
      }
    };
  });
  
  afterEach(() => {
    global.Date = realDate;
  });

  test('formats "just now" correctly', () => {
    const date = new Date('2023-03-15T11:59:58Z'); // 2 seconds ago
    expect(formatRelativeTime(date)).toBe('just now');
  });

  test('formats seconds correctly', () => {
    const date = new Date('2023-03-15T11:59:30Z'); // 30 seconds ago
    expect(formatRelativeTime(date)).toBe('30 seconds ago');
  });

  test('formats minutes correctly', () => {
    const date = new Date('2023-03-15T11:58:00Z'); // 2 minutes ago
    expect(formatRelativeTime(date)).toBe('2 minutes ago');
  });

  test('formats single minute correctly', () => {
    const date = new Date('2023-03-15T11:59:00Z'); // 1 minute ago
    expect(formatRelativeTime(date)).toBe('1 minute ago');
  });

  test('formats hours correctly', () => {
    const date = new Date('2023-03-15T10:00:00Z'); // 2 hours ago
    expect(formatRelativeTime(date)).toBe('2 hours ago');
  });
});

describe('truncateText', () => {
  test('does not truncate short text', () => {
    expect(truncateText('Short text', 20)).toBe('Short text');
  });

  test('truncates text longer than maxLength', () => {
    expect(truncateText('This is a very long text that should be truncated', 20)).toBe('This is a very lon...');
  });

  test('handles null or undefined input', () => {
    expect(truncateText(null)).toBe(null);
    expect(truncateText(undefined)).toBe(undefined);
  });

  test('uses default maxLength when not provided', () => {
    const longText = 'A'.repeat(60);
    const result = truncateText(longText);
    expect(result.length).toBe(50); // 47 characters + 3 dots
    expect(result.endsWith('...')).toBe(true);
  });
}); 