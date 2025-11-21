import { useCallback } from 'react';
import { useUrlState } from './use-url-state';

type TabConfig = {
  paramName?: string;
  defaultTab?: string;
};

export const useTabUrl = (config: TabConfig = {}) => {
  const { paramName = 'tab', defaultTab = '' } = config;
  const { getParam, setParam } = useUrlState();

  const currentTab = getParam(paramName) || defaultTab;

  const setTab = useCallback((tab: string) => {
    setParam(paramName, tab);
  }, [setParam, paramName]);

  const clearTab = useCallback(() => {
    setParam(paramName, null);
  }, [setParam, paramName]);

  return {
    currentTab,
    setTab,
    clearTab
  };
};
