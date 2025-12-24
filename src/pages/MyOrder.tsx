import React from 'react';
import OrderList from '../component/Order/OrderList';


const MyOrder: React.FC = () => {
    return (
        <div className="bg-[#f5f5f5] min-h-screen pt-5 pb-10">

            <OrderList />

        </div>
    );
};


export default MyOrder;