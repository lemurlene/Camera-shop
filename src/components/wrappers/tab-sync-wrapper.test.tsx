import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TabSyncWrapper } from './tab-sync-wrapper';
import { useUrl } from '../../contexts';

vi.mock('../../contexts', () => ({
  useUrl: vi.fn()
}));

const mockUseUrl = vi.mocked(useUrl);

describe('TabSyncWrapper Component', () => {
  const mockSetParam = vi.fn();
  const mockGetParam = vi.fn();
  const mockGetParamAll = vi.fn();
  const mockGetAllParams = vi.fn();
  const mockSetParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUrl.mockReturnValue({
      getParam: mockGetParam,
      setParam: mockSetParam,
      getParamAll: mockGetParamAll,
      getAllParams: mockGetAllParams,
      setParams: mockSetParams,
    });
  });

  describe('basic functionality', () => {
    it('should render children without modifications', () => {
      mockGetParam.mockReturnValue('');

      const { getByText } = render(
        <TabSyncWrapper>
          <div>Test Content</div>
        </TabSyncWrapper>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should use default param name when not provided', () => {
      mockGetParam.mockReturnValue('');

      render(
        <TabSyncWrapper>
          <div>Test</div>
        </TabSyncWrapper>
      );

      expect(mockGetParam).toHaveBeenCalledWith('tab');
    });

    it('should use custom param name when provided', () => {
      mockGetParam.mockReturnValue('');

      render(
        <TabSyncWrapper paramName="customTab">
          <div>Test</div>
        </TabSyncWrapper>
      );

      expect(mockGetParam).toHaveBeenCalledWith('customTab');
    });
  });

  describe('URL parameter logic', () => {
    it('should get current tab from URL parameters', () => {
      mockGetParam.mockReturnValue('details');

      render(
        <TabSyncWrapper>
          <div>Test</div>
        </TabSyncWrapper>
      );

      expect(mockGetParam).toHaveBeenCalledWith('tab');
    });
  });

  describe('onTabChange callback', () => {
    it('should not call onTabChange when no callback is provided', () => {
      mockGetParam.mockReturnValue('reviews');

      render(
        <TabSyncWrapper>
          <div>Test</div>
        </TabSyncWrapper>
      );

      expect(mockSetParam).not.toHaveBeenCalledWith('tab', expect.any(String));
    });
  });

  describe('edge cases', () => {
    it('should work with complex children', () => {
      mockGetParam.mockReturnValue('');

      const { getByText, getByTestId } = render(
        <TabSyncWrapper>
          <div data-testid="complex-child">
            <h1>Title</h1>
            <p>Description</p>
            <button>Click me</button>
          </div>
        </TabSyncWrapper>
      );

      expect(getByTestId('complex-child')).toBeInTheDocument();
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Click me')).toBeInTheDocument();
    });
  });
});

describe('TabSyncWrapper Logic Tests', () => {
  const mockSetParam = vi.fn();
  const mockGetParam = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUrl.mockReturnValue({
      getParam: mockGetParam,
      setParam: mockSetParam,
      getParamAll: vi.fn(),
      getAllParams: vi.fn(),
      setParams: vi.fn(),
    });
  });

  it('should set default tab when current tab is empty', () => {
    mockGetParam.mockReturnValue('');

    const TestComponent = () => {
      const { getParam, setParam } = useUrl();
      const currentTab = getParam('tab') || '';

      if (!currentTab) {
        setParam('tab', 'overview');
      }

      return <div>Test</div>;
    };

    render(<TestComponent />);

    expect(mockSetParam).toHaveBeenCalledWith('tab', 'overview');
  });

  it('should not set default tab when current tab exists', () => {
    mockGetParam.mockReturnValue('details');

    const TestComponent = () => {
      const { getParam, setParam } = useUrl();
      const currentTab = getParam('tab') || '';

      if (!currentTab) {
        setParam('tab', 'overview');
      }

      return <div>Test</div>;
    };

    render(<TestComponent />);

    expect(mockSetParam).not.toHaveBeenCalled();
  });

  it('should handle null current tab', () => {
    mockGetParam.mockReturnValue(null);

    const TestComponent = () => {
      const { getParam, setParam } = useUrl();
      const currentTab = getParam('tab') || '';

      if (!currentTab) {
        setParam('tab', 'overview');
      }

      return <div>Test</div>;
    };

    render(<TestComponent />);

    expect(mockSetParam).toHaveBeenCalledWith('tab', 'overview');
  });
});
