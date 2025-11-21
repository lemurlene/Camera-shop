import { TabsControls } from './tabs-controls';
import { SpecificationsTab } from './specifications-tab';
import { DescriptionTab } from './description-tab';

type ProductTabsProps = {
  activeTab: string;
  onTabChange: (tab: 'specs' | 'description') => void;
  vendorCode: string;
  category: string;
  type: string;
  level: string;
  description: string;
  id: number;
};

export const ProductTabs = ({
  activeTab,
  onTabChange,
  vendorCode,
  category,
  type,
  level,
  description,
  id
}: ProductTabsProps): JSX.Element => (
  <div className="tabs product__tabs">
    <TabsControls activeTab={activeTab} onTabChange={onTabChange} />
    <div className="tabs__content">
      <SpecificationsTab
        vendorCode={vendorCode}
        category={category}
        type={type}
        level={level}
        isActive={activeTab === 'specs'}
      />
      <DescriptionTab
        description={description}
        id={id}
        isActive={activeTab === 'description'}
      />
    </div>
  </div>
);
