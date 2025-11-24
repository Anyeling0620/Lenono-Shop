import React from 'react';

interface LoginModeTabsProps {
  mode: 'quick' | 'password';
  onModeChange: (mode: 'quick' | 'password') => void;
}

const LoginModeTabs: React.FC<LoginModeTabsProps> = ({
  mode,
  onModeChange
}) => {
  const tabs = [
    { key: 'quick' as const, label: '快捷登录' },
    { key: 'password' as const, label: '账号密码登录' }
  ];

  return (
    <div className="flex">
      {tabs.map((tab, index) => (
        <div 
          key={tab.key}
          className={`${index === 0 ? 'ml-0' : 'ml-[39px]'} cursor-pointer relative`}
          onClick={() => onModeChange(tab.key)}
        >
          <div className={`${mode === tab.key ? 'text-[#252525] font-medium' : 'text-[#787878]'} text-[16px] ml-[5px] relative text-center ${tab.key === 'password' ? 'whitespace-nowrap' : ''}`}>
            {tab.label}
          </div>
          <div 
            className={`${mode === tab.key ? 'visible' : 'invisible'} w-10 bg-[#e1140a] h-[3px] left-1/2 -ml-[20px] absolute top-[25px] transition-all duration-200`} 
          />
        </div>
      ))}
    </div>
  );
};

export default LoginModeTabs