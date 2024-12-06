import { useState } from 'react';
import { FaWheelchair } from 'react-icons/fa';
import { FaEarDeaf, FaEyeLowVision } from 'react-icons/fa6';

const AccessibilityOptions = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const options = [
    {
      title: 'Visual Impairment',
      description: 'Text to speech, audio description',
      icon: <FaEyeLowVision className="text-5xl text-black" />,
    },
    {
      title: 'Hearing Impairment',
      description: 'Speech to text, image description',
      icon: <FaEarDeaf className="text-5xl text-black" />,
    },
    {
      title: 'Physical Disability',
      description: 'Resizable',
      icon: <FaWheelchair className="text-5xl text-black" />,
    },
  ];

  return (
    <div className="p-14 bg-white rounded-lg shadow-lg w-full md:w-2/3 mx-auto">
      {options.map((item, index) => (
        <div key={index} className="mb-4 border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(index)}
            className="w-full flex justify-between items-center p-6 text-2xl font-bold bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            <div className="flex items-center gap-6">
              <div className="bg-white p-4 rounded-full">{item.icon}</div>
              <span className="text-2xl">{item.title}</span>{' '}
            </div>
            <span className="text-2xl">
              {openSection === index ? '▲' : '▼'}
            </span>
          </button>
          {openSection === index && (
            <div className="p-6 bg-gray-50 text-xl text-gray-700">
              {item.description}
            </div>
          )}
        </div>
      ))}

      {/* Language Selector */}
      <div className="mt-6 flex justify-end">
        <div className="bg-gray-100 rounded-lg shadow-md p-3 w-fit">
          <select
            id="language"
            className="bg-gray-100 text-lg focus:outline-none"
          >
            <option value="" selected>
              Select Language
            </option>{' '}
            <option value="english">English</option>
            <option value="twi">Twi</option>
            <option value="ga">Ga</option>
            <option value="fafra">Fafra</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityOptions;
