import { normalizeImagePath } from './utils';

describe('normalizeImagePath function', () => {
  it.each([
    ['/images/test.jpg', '/images/test.jpg'],
    ['images/test.jpg', '/images/test.jpg'],
    ['', '/'],
    ['/', '/'],
    ['assets/images/photo.png', '/assets/images/photo.png'],
    ['/already/has/slash.jpg', '/already/has/slash.jpg']
  ])('should normalize path "%s" to "%s"', (input, expected) => {
    const result = normalizeImagePath(input);
    expect(result).toBe(expected);
  });
});
