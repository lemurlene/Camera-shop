import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UrlProvider, useUrl } from './url-context';
import { useUrlState } from '../hooks';

vi.mock('../hooks', () => ({
  useUrlState: vi.fn(),
}));

const mockUseUrlState = useUrlState as MockedFunction<typeof useUrlState>;

const TestConsumer = () => {
  const url = useUrl();

  return (
    <div>
      <div data-testid="getParam">{url.getParam('test') || 'null'}</div>
      <div data-testid="getParamAll">{url.getParamAll('test').join(',')}</div>
      <button onClick={() => url.setParam('test', 'value')}>Set Param</button>
      <button onClick={() => url.setParams({ key: 'value' })}>Set Params</button>
      <div data-testid="allParams">{JSON.stringify(url.getAllParams())}</div>
    </div>
  );
};

const TestComponentWithoutProvider = () => {
  useUrl();
  return <div>Should throw error</div>;
};

describe('UrlContext', () => {
  const mockSearchParams = new URLSearchParams();
  const mockUrlState = {
    getParam: vi.fn(),
    getParamAll: vi.fn(),
    setParam: vi.fn(),
    setParams: vi.fn(),
    getAllParams: vi.fn(),
    searchParams: mockSearchParams,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUrlState.mockReturnValue(mockUrlState);
  });

  describe('UrlProvider', () => {
    it('should render children and provide context', () => {
      mockUrlState.getParam.mockReturnValue('test-value');
      mockUrlState.getParamAll.mockReturnValue(['value1', 'value2']);
      mockUrlState.getAllParams.mockReturnValue({ key: 'value' });

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(screen.getByTestId('getParam')).toHaveTextContent('test-value');
      expect(screen.getByTestId('getParamAll')).toHaveTextContent('value1,value2');
      expect(screen.getByTestId('allParams')).toHaveTextContent('{"key":"value"}');
    });

    it('should call useUrlState hook', () => {
      render(
        <UrlProvider>
          <div>Test Child</div>
        </UrlProvider>
      );

      expect(mockUseUrlState).toHaveBeenCalledTimes(1);
    });

    it('should pass urlState to context value', () => {
      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      const setParamButton = screen.getByText('Set Param');
      setParamButton.click();

      expect(mockUrlState.setParam).toHaveBeenCalledWith('test', 'value');
    });
  });

  describe('useUrl hook', () => {
    it('should return context value when used within provider', () => {
      mockUrlState.getParam.mockReturnValue('context-value');

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(screen.getByTestId('getParam')).toHaveTextContent('context-value');
    });

    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error');
      consoleError.mockImplementation(() => undefined);

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useUrl must be used within a UrlProvider');

      consoleError.mockRestore();
    });

    it('should provide all context methods', () => {
      mockUrlState.getParam.mockReturnValue(null);
      mockUrlState.getParamAll.mockReturnValue([]);
      mockUrlState.getAllParams.mockReturnValue({});

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      const setParamButton = screen.getByText('Set Param');
      const setParamsButton = screen.getByText('Set Params');

      setParamButton.click();
      setParamsButton.click();

      expect(mockUrlState.setParam).toHaveBeenCalledWith('test', 'value');
      expect(mockUrlState.setParams).toHaveBeenCalledWith({ key: 'value' });
    });
  });

  describe('context methods integration', () => {
    it('should integrate getParam method correctly', () => {
      mockUrlState.getParam.mockReturnValue('param-value');

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(mockUrlState.getParam).toHaveBeenCalledWith('test');
      expect(screen.getByTestId('getParam')).toHaveTextContent('param-value');
    });

    it('should integrate getParamAll method correctly', () => {
      mockUrlState.getParamAll.mockReturnValue(['val1', 'val2', 'val3']);

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(mockUrlState.getParamAll).toHaveBeenCalledWith('test');
      expect(screen.getByTestId('getParamAll')).toHaveTextContent('val1,val2,val3');
    });

    it('should integrate setParam method correctly', () => {
      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      const setParamButton = screen.getByText('Set Param');
      setParamButton.click();

      expect(mockUrlState.setParam).toHaveBeenCalledWith('test', 'value');
    });

    it('should integrate setParams method correctly', () => {
      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      const setParamsButton = screen.getByText('Set Params');
      setParamsButton.click();

      expect(mockUrlState.setParams).toHaveBeenCalledWith({ key: 'value' });
    });

    it('should integrate getAllParams method correctly', () => {
      const mockParams = {
        page: '1',
        sort: 'price',
        category: ['electronics', 'phones'],
      };
      mockUrlState.getAllParams.mockReturnValue(mockParams);

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(mockUrlState.getAllParams).toHaveBeenCalled();
      expect(screen.getByTestId('allParams')).toHaveTextContent(JSON.stringify(mockParams));
    });
  });

  describe('edge cases', () => {
    it('should handle null values from getParam', () => {
      mockUrlState.getParam.mockReturnValue(null);

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(screen.getByTestId('getParam')).toHaveTextContent('null');
    });

    it('should handle empty array from getParamAll', () => {
      mockUrlState.getParamAll.mockReturnValue([]);

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(screen.getByTestId('getParamAll')).toHaveTextContent('');
    });

    it('should handle empty object from getAllParams', () => {
      mockUrlState.getAllParams.mockReturnValue({});

      render(
        <UrlProvider>
          <TestConsumer />
        </UrlProvider>
      );

      expect(screen.getByTestId('allParams')).toHaveTextContent('{}');
    });

    it('should work with multiple consumers', () => {
      const AnotherConsumer = () => {
        const url = useUrl();
        return <div data-testid="another">{url.getParam('another') || 'null'}</div>;
      };

      mockUrlState.getParam.mockImplementation((key: string) => {
        if (key === 'test') {
          return 'test-value';
        }
        if (key === 'another') {
          return 'another-value';
        }
        return null;
      });

      render(
        <UrlProvider>
          <TestConsumer />
          <AnotherConsumer />
        </UrlProvider>
      );

      expect(screen.getByTestId('getParam')).toHaveTextContent('test-value');
      expect(screen.getByTestId('another')).toHaveTextContent('another-value');
    });
  });
});
