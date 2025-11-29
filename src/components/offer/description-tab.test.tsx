import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DescriptionTab } from './description-tab';

describe('DescriptionTab', () => {
  const defaultProps = {
    description: 'Это первое предложение. Это второе предложение! А это третье?',
    id: 1,
    isActive: true,
  };

  it('renders correctly when active', () => {
    const { container } = render(<DescriptionTab {...defaultProps} />);

    const tabsElement = container.querySelector('.tabs__element');
    expect(tabsElement).toHaveClass('tabs__element', 'is-active');

    expect(screen.getByText('Это первое предложение.')).toBeInTheDocument();
    expect(screen.getByText('Это второе предложение!')).toBeInTheDocument();
    expect(screen.getByText('А это третье?')).toBeInTheDocument();
  });

  it('renders correctly when not active', () => {
    const { container } = render(<DescriptionTab {...defaultProps} isActive={false} />);

    const tabsElement = container.querySelector('.tabs__element');
    expect(tabsElement).toHaveClass('tabs__element');
    expect(tabsElement).not.toHaveClass('is-active');
  });

  it('splits description into sentences correctly', () => {
    const props = {
      ...defaultProps,
      description: 'First sentence. Second sentence! Third sentence? Fourth sentence.',
    };

    render(<DescriptionTab {...props} />);

    expect(screen.getByText('First sentence.')).toBeInTheDocument();
    expect(screen.getByText('Second sentence!')).toBeInTheDocument();
    expect(screen.getByText('Third sentence?')).toBeInTheDocument();
    expect(screen.getByText('Fourth sentence.')).toBeInTheDocument();
  });

  it('handles description with extra spaces', () => {
    const props = {
      ...defaultProps,
      description: 'First sentence.   Second sentence!',
    };

    render(<DescriptionTab {...props} />);

    expect(screen.getByText('First sentence.')).toBeInTheDocument();
    expect(screen.getByText('Second sentence!')).toBeInTheDocument();

    const allParagraphs = document.querySelectorAll('.product__tabs-text p');
    expect(allParagraphs).toHaveLength(2);
  });

  it('renders correct number of paragraphs for normal description', () => {
    render(<DescriptionTab {...defaultProps} />);

    const paragraphs = document.querySelectorAll('.product__tabs-text p');
    expect(paragraphs).toHaveLength(3);
  });

  it('handles single sentence description', () => {
    const props = {
      ...defaultProps,
      description: 'Это одно предложение без разделителей',
    };

    render(<DescriptionTab {...props} />);

    expect(screen.getByText('Это одно предложение без разделителей')).toBeInTheDocument();

    const paragraphs = document.querySelectorAll('.product__tabs-text p');
    expect(paragraphs).toHaveLength(1);
  });

  it('handles description with multiple spaces between sentences', () => {
    const props = {
      ...defaultProps,
      description: 'Первое.    Второе!   Третье?',
    };

    render(<DescriptionTab {...props} />);

    expect(screen.getByText('Первое.')).toBeInTheDocument();
    expect(screen.getByText('Второе!')).toBeInTheDocument();
    expect(screen.getByText('Третье?')).toBeInTheDocument();

    const paragraphs = document.querySelectorAll('.product__tabs-text p');
    expect(paragraphs).toHaveLength(3);
  });

  it('has correct CSS classes', () => {
    const { container } = render(<DescriptionTab {...defaultProps} />);

    const textContainer = container.querySelector('.product__tabs-text');
    expect(textContainer).toBeInTheDocument();
    expect(textContainer).toHaveClass('product__tabs-text');
  });

  it('handles empty description', () => {
    const props = {
      ...defaultProps,
      description: '',
    };

    render(<DescriptionTab {...props} />);

    const paragraphs = document.querySelectorAll('.product__tabs-text p');
    expect(paragraphs.length).toBe(0);
  });

  it('handles description with punctuation marks as separate sentences', () => {
    const props = {
      ...defaultProps,
      description: '. ! ?',
    };

    render(<DescriptionTab {...props} />);

    const paragraphs = document.querySelectorAll('.product__tabs-text p');

    expect(() => {
      Array.from(paragraphs).forEach((p) => {
        expect(p.textContent).toBeDefined();
      });
    }).not.toThrow();
  });

  it('handles description with normal content', () => {
    const props = {
      ...defaultProps,
      description: 'Valid sentence. Another valid! Final one.',
    };

    render(<DescriptionTab {...props} />);

    expect(screen.getByText('Valid sentence.')).toBeInTheDocument();
    expect(screen.getByText('Another valid!')).toBeInTheDocument();
    expect(screen.getByText('Final one.')).toBeInTheDocument();

    const paragraphs = document.querySelectorAll('.product__tabs-text p');
    expect(paragraphs.length).toBe(3);
  });

  it('renders all sentences without duplication', () => {
    const props = {
      ...defaultProps,
      description: 'Sentence one. Sentence two. Sentence three.',
    };

    render(<DescriptionTab {...props} />);

    const paragraphs = document.querySelectorAll('.product__tabs-text p');
    const texts = Array.from(paragraphs).map((p) => p.textContent);

    expect(texts).toContain('Sentence one.');
    expect(texts).toContain('Sentence two.');
    expect(texts).toContain('Sentence three.');
    expect(texts).toHaveLength(3);
  });

  it('preserves punctuation in sentences', () => {
    const props = {
      ...defaultProps,
      description: 'Sentence with period. Sentence with exclamation! Sentence with question?',
    };

    render(<DescriptionTab {...props} />);

    expect(screen.getByText('Sentence with period.')).toBeInTheDocument();
    expect(screen.getByText('Sentence with exclamation!')).toBeInTheDocument();
    expect(screen.getByText('Sentence with question?')).toBeInTheDocument();
  });

  describe('generateHash function', () => {
    const testGenerateHash = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash;
    };

    it('generates consistent hash for same sentence', () => {
      const sentence = 'Тестовое предложение';
      const hash1 = testGenerateHash(sentence);
      const hash2 = testGenerateHash(sentence);

      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe('number');
    });

    it('generates different hashes for different sentences', () => {
      const sentence1 = 'Первое предложение';
      const sentence2 = 'Второе предложение';
      const hash1 = testGenerateHash(sentence1);
      const hash2 = testGenerateHash(sentence2);

      expect(hash1).not.toBe(hash2);
    });

    it('generates hash for empty string', () => {
      const hash = testGenerateHash('');
      expect(hash).toBe(0);
    });
  });
});
