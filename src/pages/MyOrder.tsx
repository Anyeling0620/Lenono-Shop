import React from 'react';
import OrderList from '../component/Order/OrderList';


const MyOrder: React.FC = () => {
    return (
        <div className="bg-[#f5f5f5] min-h-screen pt-5 pb-10">
            <div className="w-[1200px] mx-auto bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold mb-4">我的订单</h1>
                <OrderList />
            </div>
        </div>
    );
};


export default MyOrder;