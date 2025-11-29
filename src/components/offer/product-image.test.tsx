import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductImage } from './product-image';

describe('ProductImage', () => {
  const defaultProps = {
    previewImg: 'camera.jpg',
    previewImg2x: 'camera@2x.jpg',
    previewImgWebp: 'camera.webp',
    previewImgWebp2x: 'camera@2x.webp',
    name: 'Professional Camera',
  };

  describe('image rendering', () => {
    it('renders img element with correct attributes', () => {
      render(<ProductImage {...defaultProps} />);

      const img = screen.getByAltText(defaultProps.name);
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe('IMG');
      expect(img).toHaveAttribute('src', defaultProps.previewImg);
      expect(img).toHaveAttribute('srcset', `${defaultProps.previewImg2x} 2x`);
      expect(img).toHaveAttribute('width', '560');
      expect(img).toHaveAttribute('height', '480');
      expect(img).toHaveAttribute('alt', defaultProps.name);
    });

    it('renders webp source with correct attributes', () => {
      const { container } = render(<ProductImage {...defaultProps} />);

      const source = container.querySelector('source');
      expect(source).toBeInTheDocument();
      expect(source).toHaveAttribute('type', 'image/webp');
      expect(source).toHaveAttribute('srcset', `${defaultProps.previewImgWebp}, ${defaultProps.previewImgWebp2x} 2x`);
    });
  });

  describe('structure and layout', () => {
    it('wraps content in correct container classes', () => {
      const { container } = render(<ProductImage {...defaultProps} />);

      const productImgDiv = container.querySelector('.product__img');
      expect(productImgDiv).toBeInTheDocument();

      const picture = productImgDiv?.querySelector('picture');
      expect(picture).toBeInTheDocument();
    });

    it('maintains correct element hierarchy', () => {
      const { container } = render(<ProductImage {...defaultProps} />);

      const productImgDiv = container.querySelector('.product__img');
      const picture = productImgDiv?.querySelector('picture');
      const source = picture?.querySelector('source');
      const img = picture?.querySelector('img');

      expect(productImgDiv).toContainElement(picture as HTMLElement);
      expect(picture).toContainElement(source as HTMLElement);
      expect(picture).toContainElement(img as HTMLElement);
    });
  });

  describe('accessibility', () => {
    it('provides meaningful alt text', () => {
      render(<ProductImage {...defaultProps} />);

      const img = screen.getByAltText(defaultProps.name);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', defaultProps.name);
    });

    it('has correct image dimensions', () => {
      render(<ProductImage {...defaultProps} />);

      const img = screen.getByAltText(defaultProps.name);
      expect(img).toHaveAttribute('width', '560');
      expect(img).toHaveAttribute('height', '480');
    });
  });
});
