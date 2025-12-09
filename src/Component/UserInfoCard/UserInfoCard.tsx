import { CgShoppingCart } from "react-icons/cg"; import { MdOutlineEditLocation } from "react-icons/md";
import { RiMessageLine } from "react-icons/ri"; import { RiFileList2Line } from "react-icons/ri";
import type { FC } from "react";
import UserHeader from "./UserHeader";
import CouponSection from "./CouponSection";
import FunctionIconButton from "./FunctionIconButton";
import useUserInfoStore from "../../store/userInfostore";


interface fbItem {
  icon: React.ReactNode;
  text: string;
  to: string;
  selectedKey?:string;
  hasBadge: boolean;  //是否显示角标
}

const functionButtons: fbItem[] = [
  {
    icon: <RiFileList2Line size={40} />,
    text: '我的订单',
    to: '/my-order',
    hasBadge: false,
  },
  {
    icon: <CgShoppingCart size={40} />,
    text: '购物车',
    to: '/shopping-cart',
    hasBadge: false,
  },
  {
    icon: <MdOutlineEditLocation size={40} />,
    text: '地址管理',
    to: '',
    hasBadge: false,
  },
  {
    icon: <RiMessageLine size={40} />,
    text: '消息中心',
    to: '/user-center',
    selectedKey: '14',
    hasBadge: true,
  },
];

const UserInfoCard: FC = () => {
  const userName = useUserInfoStore((state) => state.nikeName);
  const avatar = useUserInfoStore((state) => state.avatar);
  const memberType = useUserInfoStore((state) => state.memberType);
  const couponCount = useUserInfoStore((state) => state.couponsCount);

  return (
    <div className='w-[360px] h-[200px] p-2 m-auto'>
      <div className='w-[340px]'>
        <UserHeader
          avatar={avatar}
          userName={userName}
          memberType={memberType}
          centerLink='/user-center'
        />
        <CouponSection count={couponCount} detailLink='/user-center'/>
        <div className='mt-2 px-1 py-3 grid grid-cols-4'>
          {functionButtons.map((btn) => (
            <FunctionIconButton
              key={btn.text}
              icon={btn.icon}
              text={btn.text}
              to={btn.to}
              selectedKey={btn.selectedKey}
              hasBadge={btn.hasBadge}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;