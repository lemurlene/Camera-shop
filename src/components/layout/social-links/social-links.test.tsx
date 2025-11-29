import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SocialLinksMemo } from './social-links';
import { SOCIAL_LINKS } from './const';

describe('SocialLinks component', () => {
  it('should render all social links', () => {
    render(<SocialLinksMemo />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('social');

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(SOCIAL_LINKS.length);
    expect(listItems[0]).toHaveClass('social__item');
  });

  it('should render correct links with attributes', () => {
    render(<SocialLinksMemo />);

    const links = screen.getAllByRole('link');

    SOCIAL_LINKS.forEach((socialLink, index) => {
      const link = links[index];
      expect(link).toHaveAttribute('href', socialLink.href);
      expect(link).toHaveAttribute('aria-label', socialLink.ariaLabel);
      expect(link).toHaveClass('link');

      const svg = link.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('aria-hidden', 'true');

      const useElement = svg?.querySelector('use');
      expect(useElement).toHaveAttribute('xlink:href', socialLink.icon);
    });
  });

  it('should have correct social links data', () => {
    expect(SOCIAL_LINKS).toBeInstanceOf(Array);
    expect(SOCIAL_LINKS.length).toBeGreaterThan(0);

    SOCIAL_LINKS.forEach((socialLink) => {
      expect(socialLink).toHaveProperty('href');
      expect(socialLink).toHaveProperty('ariaLabel');
      expect(socialLink).toHaveProperty('icon');
      expect(typeof socialLink.href).toBe('string');
      expect(typeof socialLink.ariaLabel).toBe('string');
      expect(typeof socialLink.icon).toBe('string');
    });
  });

  it('should be memoized', () => {
    const { rerender } = render(<SocialLinksMemo />);

    const firstRenderList = screen.getByRole('list');

    rerender(<SocialLinksMemo />);

    const secondRenderList = screen.getByRole('list');

    expect(firstRenderList).toBe(secondRenderList);
  });

  it('should render links in correct order', () => {
    render(<SocialLinksMemo />);

    const links = screen.getAllByRole('link');

    SOCIAL_LINKS.forEach((socialLink, index) => {
      const link = links[index];
      expect(link).toHaveAttribute('aria-label', socialLink.ariaLabel);
    });
  });
});
