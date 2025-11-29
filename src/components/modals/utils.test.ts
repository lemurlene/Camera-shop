import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getFocusableElements } from './utils';

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(50);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getFocusableElements with global mock', () => {
  it('should find all focusable elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button>Button</button>
      <a href="#">Link</a>
      <input type="text">
      <select><option>Option</option></select>
      <textarea></textarea>
      <div tabindex="0">Focusable Div</div>
    `;

    const result = getFocusableElements(container);

    expect(result).toHaveLength(6);
  });

  it('should exclude disabled elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button disabled>Disabled</button>
      <button>Enabled</button>
    `;

    const result = getFocusableElements(container);

    expect(result).toHaveLength(1);
    expect(result[0].textContent).toBe('Enabled');
  });

  it('should exclude invisible elements when mocked as zero', () => {
    const mockOffsetWidth = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get');
    const mockOffsetHeight = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get');

    mockOffsetWidth.mockImplementation(function(this: HTMLElement) {
      return this.textContent?.includes('Hidden') ? 0 : 100;
    });

    mockOffsetHeight.mockImplementation(function(this: HTMLElement) {
      return this.textContent?.includes('Hidden') ? 0 : 50;
    });

    const container = document.createElement('div');
    container.innerHTML = `
      <button>Hidden Button</button>
      <button>Visible Button</button>
    `;

    const result = getFocusableElements(container);

    expect(result).toHaveLength(1);
    expect(result[0].textContent).toBe('Visible Button');
  });
});
