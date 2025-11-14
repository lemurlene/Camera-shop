import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UrlStateConfig {
  replace?: boolean;
}

export const useUrlState = (config: UrlStateConfig = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { replace = true } = config;

  const getParam = useCallback((key: string): string | null => searchParams.get(key), [searchParams]);

  const getParamAll = useCallback((key: string): string[] => searchParams.getAll(key), [searchParams]);

  const setParam = useCallback((key: string, value: string | string[] | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === null) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach((v) => newParams.append(key, v));
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams, { replace });
  }, [searchParams, setSearchParams, replace]);

  const setParams = useCallback((params: Record<string, string | string[] | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.delete(key);
        value.forEach((v) => newParams.append(key, v));
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams, { replace });
  }, [searchParams, setSearchParams, replace]);

  const getAllParams = useCallback(() => {
    const params: Record<string, string | string[]> = {};

    for (const [key, value] of searchParams.entries()) {
      const values = searchParams.getAll(key);
      if (values.length === 1) {
        params[key] = value;
      } else {
        params[key] = values;
      }
    }

    return params;
  }, [searchParams]);

  return useMemo(() => ({
    getParam,
    getParamAll,
    setParam,
    setParams,
    getAllParams,
    searchParams
  }), [getParam, getParamAll, setParam, setParams, getAllParams, searchParams]);
};
