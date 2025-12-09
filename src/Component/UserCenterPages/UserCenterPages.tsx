import React from 'react';
import toast from 'react-hot-toast';
import DeviceManager from './DeviceManager';
import AccountInfo from './AccountInfo';

import Voucher from './Voucher';
import Coupon from './Coupon';

import SysNotice from './SysNotice';
import ConsultList from './ConsultList';

import ChangeEmailByCode from './ChangeEmailByCode';
import ChangeEmailByPassword from './ChangeEmailByPassword';
import ChangePwdByCode from './ChangePwdByCode';
import ChangePwdByPassword from './ChangePwdByPassword';




const Orders = () => <div>我的订单</div>;
const Cart = () => <div>我的购物车</div>;
const Comments = () => <div>我的评价</div>;
const Roast = () => <div>我的吐槽</div>;
const Address = () => <div>收货地址</div>;

const AfterSale = () => <div>我的售后</div>;
const Complaint = () => <div>我的投诉</div>;




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
    15: <ConsultList />,
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
