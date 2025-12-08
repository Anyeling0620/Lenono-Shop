import React from 'react';
import toast from 'react-hot-toast';
import DeviceManager from './DeviceManager';
import AccountInfo from './AccountInfo';


/* ------ 各个页面组件（你可以替换成自己的） ------ */

const ChangeEmailByPassword = () => <div>通过原密码更换邮箱</div>;
const ChangeEmailByCode = () => <div>通过验证码更换邮箱</div>;
const ChangePwdByPassword = () => <div>通过原密码更改</div>;
const ChangePwdByCode = () => <div>通过验证码更改</div>;

const Orders = () => <div>我的订单</div>;
const Cart = () => <div>我的购物车</div>;
const Comments = () => <div>我的评价</div>;
const Roast = () => <div>我的吐槽</div>;
const Address = () => <div>收货地址</div>;

const AfterSale = () => <div>我的售后</div>;
const Complaint = () => <div>我的投诉</div>;

const Coupon = () => <div>我的优惠券</div>;
const Voucher = () => <div>我的代金券</div>;

const SysNotice = () => <div>系统通知</div>;
const MyConsult = () => <div>我的咨询</div>;



/* ------------ 用 Record 构建 key → 组件 的映射表 ------------ */

const pages: Record<string, React.ReactNode> = {
    k1: <AccountInfo />,
    1: <ChangeEmailByPassword />,
    2: <ChangeEmailByCode />,
    3: <ChangePwdByPassword />,
    4: <ChangePwdByCode />,
    k4: <DeviceManager />,

    5: <Orders />,
    6: <Cart />,
    7: <Comments />,
    8: <Roast />,
    9: <Address />,

    10: <AfterSale />,
    11: <Complaint />,

    12: <Coupon />,
    13: <Voucher />,

    14: <SysNotice />,
    15: <MyConsult />,
};



interface Props {
    selectedKey: string;
}

const UserCenterPages: React.FC<Props> = ({ selectedKey }) => {
    toast(selectedKey)
    return (
        <div className="bg-white ml-4 rounded-md  p-5 min-h-[90vh] w-full">
            {pages[selectedKey] || <div>页面不存在</div>}
        </div>
    );
};


export default UserCenterPages;
