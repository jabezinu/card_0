import { describe, it, expect } from 'vitest';
import { formatUSSD } from './utils';

describe('formatUSSD', () => {
  it('should format a valid 12-digit code', () => {
    expect(formatUSSD('123456789012')).toBe('*805*123456789012#');
  });

  it('should format a valid 20-digit code', () => {
    expect(formatUSSD('12345678901234567890')).toBe('*805*12345678901234567890#');
  });

  it('should throw error for code shorter than 12 digits', () => {
    expect(() => formatUSSD('12345678901')).toThrow('Invalid code: must be 12-20 digits');
  });

  it('should throw error for code longer than 20 digits', () => {
    expect(() => formatUSSD('123456789012345678901')).toThrow('Invalid code: must be 12-20 digits');
  });

  it('should throw error for code with non-digit characters', () => {
    expect(() => formatUSSD('12345678901a')).toThrow('Invalid code: must be 12-20 digits');
  });

  it('should throw error for empty string', () => {
    expect(() => formatUSSD('')).toThrow('Invalid code: must be 12-20 digits');
  });
});