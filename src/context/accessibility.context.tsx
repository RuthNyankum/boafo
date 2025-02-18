import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'all' | 'feature';

interface AccessibilityContextState {
  viewMode: ViewMode;
  selectedFeature: number | null;
  toggleFeature: (index: number) => void;
  backToFeatures: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextState | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const toggleFeature = (index: number) => {
    setSelectedFeature(index);
    setViewMode('feature');
  };

  const backToFeatures = () => {
    setSelectedFeature(null);
    setViewMode('all');
  };

  return (
    <AccessibilityContext.Provider value={{ viewMode, selectedFeature, toggleFeature, backToFeatures }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};
