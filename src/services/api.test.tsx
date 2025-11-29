import axios, { AxiosInstance } from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAPI } from './';
import { BASE_URL, SERVER_TIMEOUT } from './const';

vi.mock('axios');

describe('createAPI', () => {
  let mockUse: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUse = vi.fn();
    const mockInstance = {
      interceptors: {
        response: {
          use: mockUse,
        },
      },
    } as unknown as AxiosInstance;

    vi.mocked(axios.create).mockReturnValue(mockInstance);
  });

  it('should create axios instance with correct configuration', () => {
    createAPI();

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: BASE_URL,
      timeout: SERVER_TIMEOUT,
    });
  });

  it('should register response interceptor', () => {
    createAPI();

    expect(mockUse).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
  });
});
