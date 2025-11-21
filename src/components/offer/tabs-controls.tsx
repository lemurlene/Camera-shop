type TabsControlsProps = {
  activeTab: string;
  onTabChange: (tab: 'specs' | 'description') => void;
};

export const TabsControls = ({
  activeTab,
  onTabChange
}: TabsControlsProps): JSX.Element => (
  <div className="tabs__controls product__tabs-controls">
    <button
      className={`tabs__control ${activeTab === 'specs' ? 'is-active' : ''}`}
      type="button"
      onClick={() => onTabChange('specs')}
    >
        Характеристики
    </button>
    <button
      className={`tabs__control ${activeTab === 'description' ? 'is-active' : ''}`}
      type="button"
      onClick={() => onTabChange('description')}
    >
        Описание
    </button>
  </div>
);
