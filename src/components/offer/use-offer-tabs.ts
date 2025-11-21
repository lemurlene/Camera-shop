import { useEffect } from 'react';
import { useTabUrl } from '../../hooks';

export const useOfferTabs = () => {
  const { currentTab, setTab } = useTabUrl({
    paramName: 'tab',
    defaultTab: 'description'
  });

  useEffect(() => {
    if (!currentTab) {
      setTab('description');
    }
  }, [currentTab, setTab]);

  const activeTab = (currentTab === 'specs' || currentTab === 'description')
    ? currentTab
    : 'description';

  return {
    activeTab,
    setTab
  };
};
