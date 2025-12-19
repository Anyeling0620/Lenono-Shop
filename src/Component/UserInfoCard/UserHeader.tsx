
import { Avatar } from "antd";
import { Link } from "react-router-dom";


interface UserHeaderProps {
  avatarUrl: string;
  userName: string;
  memberType: string;
  centerLink: string;
}

 const UserHeader: React.FC<UserHeaderProps> = ({ avatarUrl, userName, memberType, centerLink }) => {
  return (
    <div className='px-1 h-[80px] flex border-b-[1.5px] border-[#e6e6e6]'>
      <Avatar size={65} draggable={false} src={avatarUrl}>
        Lenovo
      </Avatar>
      <div className='ml-6 mt-2 w-[180px]'>
        <span className='text-[16px] max-w-[160px] font-bold inline-block truncate'>{userName}</span>
        <div className={`text-[#a9a9a9] text-[12px] h-[20px] select-none`}>
          {memberType}
        </div>
      </div>
      <Link to={centerLink} target="_user-center" className={`text-[#a9a9a9] font-light mt-[6%] ml-auto text-[13px] hover:text-red-500`}>
        个人中心
      </Link>
    </div>
  );
};

export default UserHeader;