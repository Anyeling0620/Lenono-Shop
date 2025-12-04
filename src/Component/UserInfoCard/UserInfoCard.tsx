
import { CgShoppingCart } from "react-icons/cg";import { MdOutlineEditLocation } from "react-icons/md";
import { RiMessageLine } from "react-icons/ri";import { RiFileList2Line } from "react-icons/ri";
import type { FC } from "react";
import UserHeader, { DEFAULT_AVATAR } from "./UserHeader";
import CouponSection from "./CouponSection";
import FunctionIconButton from "./FunctionIconButton";


const UserInfoCard: FC = () => {
  // 业务数据（可抽离到状态管理/接口请求）
  const userInfo = {
    userName: '魔法少女小圆123456789',
    memberLevel: '普通会员',
    avatar: DEFAULT_AVATAR,
    couponCount: 32,
  };

  // 功能按钮配置（可抽离到配置文件）
  const functionButtons = [
    {
      icon: <RiFileList2Line size={40} />,
      text: '我的订单',
      to: '',
      state: {},
      hasBadge: false,
    },
    {
      icon: <CgShoppingCart size={40} />,
      text: '购物车',
      to: '',
      state: {},
      hasBadge: false,
    },
    {
      icon: <MdOutlineEditLocation size={40} />,
      text: '地址管理',
      to: '',
      state: {},
      hasBadge: false,
    },
    {
      icon: <RiMessageLine size={40} />,
      text: '消息中心',
      to: '',
      state: {},
      hasBadge: true,
      badgeCount: 14,
    },
  ];

  return (
    <div className='w-[360px] h-[200px] p-2 m-auto'>
      <div className='w-[340px]'>
        <UserHeader
          avatar={userInfo.avatar}
          userName={userInfo.userName}
          memberLevel={userInfo.memberLevel}
          centerLink='/user-center'
        />
        <CouponSection count={userInfo.couponCount} detailLink='' />
        <div className='mt-2 px-1 py-3 grid grid-cols-4'>
          {functionButtons.map((btn) => (
            <FunctionIconButton
              key={btn.text}
              icon={btn.icon}
              text={btn.text}
              to={btn.to}
              state={btn.state}
              hasBadge={btn.hasBadge}
              badgeCount={btn.badgeCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;