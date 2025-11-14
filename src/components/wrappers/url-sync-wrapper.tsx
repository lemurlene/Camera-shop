import { ReactNode, useEffect } from 'react';
import { useUrl } from '../../contexts/url-context';

export interface UrlSyncConfig {
  params?: {
    [key: string]: {
      defaultValue?: string | string[];
      validator?: (value: string) => boolean;
      onValueChange?: (value: string | string[] | null) => void;
    };
  };
}

interface UrlSyncWrapperProps {
  children: ReactNode;
  config: UrlSyncConfig;
}

export const UrlSyncWrapper = ({ children, config }: UrlSyncWrapperProps) => {
  const { getParam, getParamAll } = useUrl();

  useEffect(() => {
    const { params = {} } = config;

    Object.entries(params).forEach(([paramName, paramConfig]) => {
      const { defaultValue, validator, onValueChange } = paramConfig;

      let value: string | string[] | null;

      if (Array.isArray(defaultValue)) {
        value = getParamAll(paramName);
        if (value.length === 0 && defaultValue.length > 0) {
          value = defaultValue;
        }
      } else {
        value = getParam(paramName);
        if (value === null && defaultValue) {
          value = defaultValue;
        }
      }

      if (validator && value) {
        if (Array.isArray(value)) {
          value = value.filter((v) => validator(v));
        } else if (!validator(value)) {
          value = null;
        }
      }

      if (onValueChange && value !== null) {
        onValueChange(value);
      }
    });
  }, [config, getParam, getParamAll]);

  return children;
};
