import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaginationList from './pagination-list';

vi.mock('./pagination-item', () => ({
  default: (props: {
    page: number;
    currentPage: number;
    createPageUrl: (page: number) => string;
    onPageClick: (page: number) => void;
  }) => {
    const { page, currentPage, createPageUrl, onPageClick } = props;

    return (
      <li>
        <a
          href={createPageUrl(page)}
          data-testid={`page-${page}`}
          data-current={String(currentPage)}
          onClick={(e) => {
            e.preventDefault();
            onPageClick(page);
          }}
        >
          {page}
        </a>
      </li>
    );
  },
}));

vi.mock('./pagination-nav-button', () => ({
  default: (props: {
    type: 'prev' | 'next';
    targetPage: number;
    createPageUrl: (page: number) => string;
    onPageClick: (page: number) => void;
  }) => {
    const { type, targetPage, createPageUrl, onPageClick } = props;

    return (
      <li>
        <a
          href={createPageUrl(targetPage)}
          data-testid={`${type}-btn`}
          data-target={String(targetPage)}
          onClick={(e) => {
            e.preventDefault();
            onPageClick(targetPage);
          }}
        >
          {type === 'prev' ? 'Назад' : 'Далее'}
        </a>
      </li>
    );
  },
}));

describe('PaginationList', () => {
  const createPageUrl = vi.fn((page: number) => `?page=${page}`);
  const onPageClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pages from "pages" prop', () => {
    render(
      <PaginationList
        currentPage={2}
        pages={[1, 2, 3]}
        showPrev={false}
        showNext={false}
        prevTargetPage={1}
        nextTargetPage={3}
        createPageUrl={createPageUrl}
        onPageClick={onPageClick}
      />
    );

    expect(screen.getByTestId('page-1')).toBeInTheDocument();
    expect(screen.getByTestId('page-2')).toBeInTheDocument();
    expect(screen.getByTestId('page-3')).toBeInTheDocument();

    expect(screen.queryByTestId('prev-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('next-btn')).not.toBeInTheDocument();
  });

  it('renders prev button when showPrev=true and passes targetPage', () => {
    render(
      <PaginationList
        currentPage={4}
        pages={[4, 5, 6]}
        showPrev
        showNext={false}
        prevTargetPage={3}
        nextTargetPage={7}
        createPageUrl={createPageUrl}
        onPageClick={onPageClick}
      />
    );

    const prev = screen.getByTestId('prev-btn');
    expect(prev).toBeInTheDocument();
    expect(prev).toHaveAttribute('data-target', '3');
    expect(prev).toHaveAttribute('href', '?page=3');
  });

  it('renders next button when showNext=true and passes targetPage', () => {
    render(
      <PaginationList
        currentPage={1}
        pages={[1, 2, 3]}
        showPrev={false}
        showNext
        prevTargetPage={0}
        nextTargetPage={4}
        createPageUrl={createPageUrl}
        onPageClick={onPageClick}
      />
    );

    const next = screen.getByTestId('next-btn');
    expect(next).toBeInTheDocument();
    expect(next).toHaveAttribute('data-target', '4');
    expect(next).toHaveAttribute('href', '?page=4');
  });

  it('calls onPageClick with page number when page item clicked', () => {
    render(
      <PaginationList
        currentPage={2}
        pages={[1, 2, 3]}
        showPrev={false}
        showNext={false}
        prevTargetPage={1}
        nextTargetPage={3}
        createPageUrl={createPageUrl}
        onPageClick={onPageClick}
      />
    );

    fireEvent.click(screen.getByTestId('page-3'));
    expect(onPageClick).toHaveBeenCalledTimes(1);
    expect(onPageClick).toHaveBeenCalledWith(3);
  });

  it('calls onPageClick with prevTargetPage when prev clicked', () => {
    render(
      <PaginationList
        currentPage={4}
        pages={[4, 5, 6]}
        showPrev
        showNext={false}
        prevTargetPage={3}
        nextTargetPage={7}
        createPageUrl={createPageUrl}
        onPageClick={onPageClick}
      />
    );

    fireEvent.click(screen.getByTestId('prev-btn'));
    expect(onPageClick).toHaveBeenCalledTimes(1);
    expect(onPageClick).toHaveBeenCalledWith(3);
  });

  it('calls onPageClick with nextTargetPage when next clicked', () => {
    render(
      <PaginationList
        currentPage={1}
        pages={[1, 2, 3]}
        showPrev={false}
        showNext
        prevTargetPage={0}
        nextTargetPage={4}
        createPageUrl={createPageUrl}
        onPageClick={onPageClick}
      />
    );

    fireEvent.click(screen.getByTestId('next-btn'));
    expect(onPageClick).toHaveBeenCalledTimes(1);
    expect(onPageClick).toHaveBeenCalledWith(4);
  });
});
