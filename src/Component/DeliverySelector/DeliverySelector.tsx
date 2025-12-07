import React, { useState, useRef, useEffect } from "react";
import { getProvinces, getCitiesByProvince } from "../../assets/data/chinaRegions";

interface DeliveryLocation {
  province: string;
  city: string;
  district: string;
  fullAddress: string;
}

interface DeliverySelectorProps {
  onLocationChange?: (location: DeliveryLocation) => void;
}

const DeliverySelector: React.FC<DeliverySelectorProps> = ({ onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation>({
    province: "北京",
    city: "北京市",
    district: "海淀区",
    fullAddress: "北京 北京市 海淀区"
  });

  // 级联选择状态
  const [selectedProvince, setSelectedProvince] = useState<string>("北京");
  const [selectedCity, setSelectedCity] = useState<string>("北京市");
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 获取数据
  const provinces = getProvinces();
  const cities = getCitiesByProvince(selectedProvince);

  // 处理省份选择
  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setExpandedProvince(expandedProvince === province ? null : province);
    setExpandedCity(null); // 收起城市选择
    // 重置城市和区县选择
    const firstCity = getCitiesByProvince(province)[0];
    if (firstCity) {
      setSelectedCity(firstCity.city);
    }
  };

  // 处理城市选择
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setExpandedCity(expandedCity === city ? null : city);
  };

  // 处理区县选择
  const handleDistrictSelect = (district: string) => {
    const location: DeliveryLocation = {
      province: selectedProvince,
      city: selectedCity,
      district: district,
      fullAddress: `${selectedProvince} ${selectedCity} ${district}`
    };
    setSelectedLocation(location);
    setIsOpen(false);
    setExpandedProvince(null);
    setExpandedCity(null);
    onLocationChange?.(location);
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setExpandedProvince(null);
        setExpandedCity(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="border border-gray-300 px-3 py-2 cursor-pointer hover:border-[#e1140a] transition-colors flex items-center justify-between min-w-[200px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">{selectedLocation.fullAddress}</span>
        <span className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 bg-white border border-gray-300 shadow-lg z-50 w-[800px] h-[400px] overflow-hidden">
          <div className="flex h-full">
            {/* 省份选择 */}
            <div className="w-1/4 border-r border-gray-200 p-3 overflow-y-auto">
              <div className="text-sm font-medium text-gray-700 mb-3">选择省份</div>
              <div className="space-y-1">
                {provinces.map((province) => (
                  <div
                    key={province}
                    className={`px-2 py-2 cursor-pointer text-sm rounded hover:bg-gray-50 flex items-center justify-between ${
                      selectedProvince === province ? 'bg-red-50 text-[#e1140a] border border-[#e1140a]' : ''
                    }`}
                    onClick={() => handleProvinceSelect(province)}
                  >
                    <span>{province}</span>
                    <span className={`transition-transform ${expandedProvince === province ? 'rotate-90' : ''}`}>▶</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 城市选择 */}
            {expandedProvince && (
              <div className="w-1/4 border-r border-gray-200 p-3 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700 mb-3">选择城市</div>
                <div className="space-y-1">
                  {cities.map((cityData) => (
                    <div
                      key={cityData.city}
                      className={`px-2 py-2 cursor-pointer text-sm rounded hover:bg-gray-50 flex items-center justify-between ${
                        selectedCity === cityData.city ? 'bg-red-50 text-[#e1140a] border border-[#e1140a]' : ''
                      }`}
                      onClick={() => handleCitySelect(cityData.city)}
                    >
                      <span>{cityData.city}</span>
                      <span className={`transition-transform ${expandedCity === cityData.city ? 'rotate-90' : ''}`}>▶</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 区县选择 */}
            {expandedCity && (
              <div className="w-1/2 p-3 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700 mb-3">选择区县</div>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {cities.find(c => c.city === selectedCity)?.districts.map((district) => (
                    <div
                      key={district}
                      className="px-2 py-2 cursor-pointer text-sm rounded hover:bg-gray-50 text-gray-600 border border-gray-100 hover:border-[#e1140a] hover:text-[#e1140a] transition-colors"
                      onClick={() => handleDistrictSelect(district)}
                    >
                      {district}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySelector;