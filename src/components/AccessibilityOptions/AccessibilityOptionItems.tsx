import React from 'react';
import { AccessibilityOption } from '../../types/accessibility';

interface AccessibilityOptionItemProps {
  item: AccessibilityOption;
  index: number;
  openSection: number | null;
  toggleSection: (section: number) => void;
}

const AccessibilityOptionItem: React.FC<AccessibilityOptionItemProps> = ({
  item,
  index,
  openSection,
  toggleSection,
}) => {
  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <button
        onClick={() => {
          toggleSection(index);
          item.action();
        }}
        className="w-full flex justify-between items-center p-6 text-2xl font-bold bg-gray-100 hover:bg-gray-200 focus:outline-none"
        aria-expanded={openSection === index}
        aria-controls={`section-${index}`}
      >
        <div className="flex items-center gap-6">
          <div className="bg-white p-4 rounded-full">
            <item.icon size={45} color="black" />
          </div>
          <span className="text-2xl">{item.title}</span>
        </div>
        <span className="text-2xl">
          {openSection === index ? "▲" : "▼"}
        </span>
      </button>

      {openSection === index && (
        <div className="p-6 bg-gray-50 text-xl text-gray-700">
          {item.description}
        </div>
      )}
    </div>
  );
};

export default AccessibilityOptionItem;