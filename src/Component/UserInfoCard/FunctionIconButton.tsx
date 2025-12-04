import { Badge, ConfigProvider } from "antd";
import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";


interface Props {
  icon: ReactNode;
  text: string;
  to: string;
  selectedKey?:string;
  hasBadge?: boolean;
  badgeCount?: string | number;
  target?: string;
}

const FunctionIconButton: FC<Props> = ({ icon, text, to, selectedKey = '', hasBadge = false, badgeCount = '' }) => {
  return (
    <Link to={`${to}?selectedKey=${selectedKey}`} target="_user-center"  className='mx-4 flex flex-col items-center group'>
      {hasBadge ? (
        <ConfigProvider theme={{ token: { colorErrorHover: 'red' } }}>
          <Badge count={badgeCount}>
            <span className={`text-[#a9a9a9] group-hover:text-red-500`}>{icon}</span>
          </Badge>
        </ConfigProvider>
      ) : (
        <span className={`text-[#a9a9a9] group-hover:text-red-500`}>{icon}</span>
      )}
      <div className={`text-center mt-1 text-[#a9a9a9] text-[10px] font-light group-hover:text-red-500`}>
        {text}
      </div>
    </Link>
  );
};

export default FunctionIconButton;