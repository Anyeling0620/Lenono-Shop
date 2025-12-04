/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-30 20:02:00
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-30 20:06:40
 * @FilePath: \lenovo-shop\src\component\UserInfoCard\UserHeader.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { Avatar } from "antd";
import { Link } from "react-router-dom";

export const DEFAULT_AVATAR = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

interface UserHeaderProps {
  avatar: string;
  userName: string;
  memberLevel: string;
  centerLink: string;
}

 const UserHeader: React.FC<UserHeaderProps> = ({ avatar = DEFAULT_AVATAR, userName, memberLevel, centerLink }) => {
  return (
    <div className='px-1 h-[80px] flex border-b-[1.5px] border-[#e6e6e6]'>
      <Avatar size={65} draggable={false} src={avatar || null}>
        Lenovo
      </Avatar>
      <div className='ml-6 mt-2 w-[180px]'>
        <span className='text-[16px] max-w-[160px] font-bold inline-block truncate'>{userName}</span>
        <div className={`text-[#a9a9a9] text-[12px] h-[20px] select-none`}>
          {memberLevel}
        </div>
      </div>
      <Link to={centerLink} target="_user-center" className={`text-[#a9a9a9] font-light mt-[6%] ml-auto text-[13px] hover:text-red-500`}>
        个人中心
      </Link>
    </div>
  );
};

export default UserHeader;