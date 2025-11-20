import { createContext, useContext, ReactNode } from 'react';
import { useUrlState } from '../hooks';

interface UrlContextType {
  getParam: (key: string) => string | null;
  getParamAll: (key: string) => string[];
  setParam: (key: string, value: string | string[] | null) => void;
  setParams: (params: Record<string, string | string[] | null>) => void;
  getAllParams: () => Record<string, string | string[]>;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

interface UrlProviderProps {
  children: ReactNode;
}

export const UrlProvider = ({ children }: UrlProviderProps) => {
  const urlState = useUrlState();

  return (
    <UrlContext.Provider value={urlState}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = (): UrlContextType => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('useUrl must be used within a UrlProvider');
  }
  return context;
};
