import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TimeDisplay from './TimeDisplay';
import ProductCard from './ProductCard';
import SessionTab from './SessionTab';
import type { SeckillRoundListResponse, UnfinishedSeckillRoundVO, SeckillProductVO } from '../../types/flashSale';
import { getSeckillProductGroups } from '../../services/products';
import toast from 'react-hot-toast';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';

const FlashSale: React.FC = () => {
    const [seckillData, setSeckillData] = useState<SeckillRoundListResponse>({
        list: []
    });
    const [activeSession, setActiveSession] = useState<UnfinishedSeckillRoundVO | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSeckillProductGroups();
                setSeckillData(data);
                if (data.list.length > 0) {
                    setActiveSession(data.list[0]);
                }
            } catch (error) {
                globalErrorHandler.handle(error, toast.error);
            }
        }
        fetchData();
    }, []);

    if (seckillData.list.length === 0) return null;
    if (!activeSession) return null;

    // 直接使用源数据结构生成场次标签栏数据
    const sessions = seckillData.list;

    return (
        <div className="w-full mx-auto my-0 relative">
            <div className="pt-[20px]">
                <div className="relative w-[1200px] h-[340px] mx-auto my-0">
                    {/* 左侧时间信息 - 传递活跃场次的开始/结束时间 */}
                    <SessionInfo
                        startTime={activeSession.startTime}
                        endTime={activeSession.endTime}
                        data={sessions} 
                    />

                    {/* 中间商品区域 */}
                    <div className="w-[918px] absolute left-[230px] right-[49px] overflow-hidden bg-white">
                        {/* 场次标签栏 - 直接传递源数据场次列表 */}
                        <SessionTabs
                            sessions={sessions}
                            activeSession={activeSession}
                            onSessionChange={setActiveSession}
                        />

                        {/* 商品列表 - 直接传递活跃场次的源商品数据 */}
                        <ProductList products={activeSession.products} />
                    </div>

                    {/* 右侧更多链接 */}
                    <MoreLink data={sessions} />
                </div>
            </div>
        </div>
    );
};

// 时间信息组件 - 直接接收源数据的开始/结束时间
const SessionInfo: React.FC<{ startTime: string; endTime: string;data:UnfinishedSeckillRoundVO[] }> = ({ startTime, endTime,data }) => (
    <Link to="/flash-sale" state={data}>
        <div className="absolute left-0 w-[230px] h-[340px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/11/26/2b4b9fee-84ee-4fb1-9891-3b3390fb5fd5.png)] bg-[length:230px_340px]">
            <div className="mt-[44px] text-center">
                <i className="inline-block w-[120px] h-[27px] bg-[url(https://p1.lefile.cn/product/adminweb/2019/11/26/72f84116-d80c-4fb3-a39e-ae16271f6c76.png)] bg-[length:120px_27px]"></i>
            </div>
            <div className="text-center">
                <i className="inline-block mt-[22px] w-[28px] h-[60px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/12/11/eb749e1e-e9fa-48ba-95a9-b2041ad01154.png)] bg-[length:28px_60px]"></i>
            </div>
            {/* 传递源数据的开始/结束时间给时间显示组件 */}
            <TimeDisplay startTime={startTime} endTime={endTime} className="mt-[14px]" />
        </div>
    </Link>
);

// 场次标签栏组件 - 直接使用源数据类型
const SessionTabs: React.FC<{
    sessions: UnfinishedSeckillRoundVO[];
    activeSession: UnfinishedSeckillRoundVO;
    onSessionChange: (session: UnfinishedSeckillRoundVO) => void;
}> = ({ sessions, activeSession, onSessionChange }) => (
    <div className="h-[66px] leading-[66px] bg-white border-b border-b-[#e8e8e8]">
        <ul className="overflow-hidden h-full ml-[22px] text-[0px] list-none">
            {sessions.map((session) => (
                <SessionTab
                    key={session.id}
                    // 直接传递源数据场次对象
                    session={session}
                    isActive={session.id === activeSession.id}
                    onClick={() => onSessionChange(session)}
                />
            ))}
        </ul>
    </div>
);

// 商品列表组件 - 直接使用源数据商品类型
const ProductList: React.FC<{ products: SeckillProductVO[] }> = ({ products }) => (
    <div className="my-0 ml-[23px] mr-0">
        <div className="m-0">
            <ul className="w-full text-[0px] h-[273px] overflow-hidden list-none">
                {products.map((product) => (
                    <ProductCard
                        key={`${product.id}-${product.configs[0]?.id || ''}`}
                        // 直接传递源数据商品对象（包含配置项）
                        product={product}
                    />
                ))}
            </ul>
        </div>
    </div>
);

const MoreLink: React.FC<{ data: UnfinishedSeckillRoundVO[] }> = ({ data }) => (
    <Link to="/flash-sale" state={data} className="no-underline">
        <div className="absolute right-0 w-[49px] h-[340px] bg-gradient-to-br from-[#ec1111] from-1% to-[#ff8200] to-99%">
            <div className="absolute inset-0 m-auto w-[18px] h-[106px] text-sm text-white text-center cursor-pointer">
                <span className="text-white">更多秒杀</span>
                <i className="inline-block w-[18px] h-[18px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/11/26/3a702767-4b0a-4e74-a14e-8ddcf5b26609.png)] bg-[length:18px_18px] mt-[11px]"></i>
            </div>
        </div>
    </Link>
);

export default FlashSale;