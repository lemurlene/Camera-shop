import { ReactNode, useEffect } from 'react';
import { useUrl } from '../../contexts/url-context';

interface TabSyncWrapperProps {
  children: ReactNode;
  paramName?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TabSyncWrapper = ({
  children,
  paramName = 'tab',
  defaultTab = '',
  onTabChange
}: TabSyncWrapperProps) => {
  const { getParam, setParam } = useUrl();

  const currentTab = getParam(paramName) || defaultTab;

  useEffect(() => {
    if (!currentTab && defaultTab) {
      setParam(paramName, defaultTab);
    }
  }, [currentTab, defaultTab, paramName, setParam]);

  useEffect(() => {
    if (onTabChange && currentTab) {
      onTabChange(currentTab);
    }
  }, [currentTab, onTabChange]);

  return children as JSX.Element;
};
