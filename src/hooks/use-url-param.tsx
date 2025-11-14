import { useUrl } from '../contexts/url-context';

export const useUrlParam = (paramName: string, defaultValue = '') => {
  const { getParam, setParam } = useUrl();

  const value = getParam(paramName) || defaultValue;

  const setValue = (newValue: string | null) => {
    setParam(paramName, newValue);
  };

  return [value, setValue] as const;
};

export const useUrlParamAll = (paramName: string, defaultValue: string[] = []) => {
  const { getParamAll, setParam } = useUrl();

  const value = getParamAll(paramName);
  const finalValue = value.length > 0 ? value : defaultValue;

  const setValue = (newValue: string[] | null) => {
    setParam(paramName, newValue);
  };

  return [finalValue, setValue] as const;
};
