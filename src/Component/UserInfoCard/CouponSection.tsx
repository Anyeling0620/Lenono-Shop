import { Link } from "react-router-dom";

interface Props {
  count: number;
  detailLink: string;
  state?: {
    [index:string]:string | number | boolean | undefined // 索引签名
  };
}

const CouponSection: React.FC<Props> = ({ count, detailLink }) => {
  return (
    <div className={`px-1 h-[25px] flex border-b-[1.5px] border-[#e6e6e6]`}>
      <div className={`font-light text-[13px]`}>
        <span>优惠券</span>
        <span className='text-red-600 font-normal text-[14px] mx-1'>{count}</span>
        <span>张</span>
      </div>
      <div className={`ml-auto border-[#e6e6e6] text-[#a9a9a9] font-light text-[13px]`}>
        <Link target="_user-center" to={`${detailLink}?selectedKey=${12}`} className={'hover:text-red-500'}>
          查看详情
        </Link>
      </div>
    </div>
  );
};

export default CouponSection;