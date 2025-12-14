/*
 * @Description: 秒杀详情页主组件 (Smart Container)
 * @Responsibility: 
 * 1. 管理当前选中的场次状态 (activeSession)
 * 2. 实时计算当前场次的状态 (进行中/即将开始/已结束)
 * 3. 将数据和状态分发给子组件 (Header, SessionBar, ProductList)
 */
import React, { useState } from 'react';
import FlashHeader from './FlashHeader';
import FlashSessionBar from './FlashSessionBar';
import FlashProductList from './FlashProductList';
import type { flashSaleMenu, Product } from '../../types/flashSale';
import { getSessionStatus } from '../../utils/timeCalculator';


// 1. 商品数据池 (Mock Data Source) 在实际项目中，这里应该替换为 API 请求获取的数据
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '联想无线光学鼠标M26 黑色',
    image: 'https://p2.lefile.cn/product/adminweb/2024/07/05/4EfDo2O9AybZuOTSRjDne4Ea7-8771.jpg',
    currentPrice: 24.9,
    originalPrice: 52,
    discount: 4.8,
    link: 'https://item.lenovo.com.cn/product/1025414.html?pagenum=1',
    desc: '无线连接，人体工学设计，握感舒适，先进光学追踪技术',
    // ★ 修改：模拟 已抢 56% (56/100)
    soldCount: 56,
    totalCount: 100
  },
  {
    id: '2',
    name: '联想拯救者R9000P 2025 AI元启',
    image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
    currentPrice: 10299,
    originalPrice: 10499,
    discount: 9.9,
    link: '#',
    desc: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '3',
    name: 'ThinkPad T14p 2023 英特尔酷睿i5 高性能工程师本',
    image: 'https://p3.lefile.cn/product/adminweb/2023/05/25/b4TWBbIazC8GbvRbjJI2iiF3L-2897.jpg',
    currentPrice: 5699,
    originalPrice: 7699,
    discount: 7.5,
    link: '#',
    desc: '第13代智能英特尔酷睿i5-13500H/Windows 11 家庭中文版/16GB LPDDR5/512GB/核心显卡（Intel Iris Xe）/14英寸2.2K 100% sRGB高色域显示屏/夜澜黑',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '4',
    name: '异能者有线键鼠套装KM301',
    image: 'https://p1.lefile.cn/product/adminweb/2024/09/20/G5WgxTvBX7f22D8tIzhsrrNdX-1209.jpg',
    currentPrice: 42.9,
    originalPrice: 45.9,
    discount: 9.4,
    link: '#',
    desc: '全尺寸布局,巧克力键帽,三档 DPI 可调,一年质保',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '5',
    name: '联想多功能双肩包B1801s-灰黑色',
    image: 'https://p1.lefile.cn/product/adminweb/2023/10/25/X4xFQrr5M0MgwJs7mdZW6rDoZ-7279.jpg',
    currentPrice: 59,
    originalPrice: 69,
    discount: 8.6,
    link: '#',
    desc: '17.3英寸，防水面料，透气背板，背负减压，拉杆箱固定带，出行更从容。赠：1次价值98元电脑远程软件服务',
    // 模拟 已抢光 (10/10)
    soldCount: 10,
    totalCount: 10
  },
  {
    id: '6',
    name: '联想小新系列笔记本4年保值换新-生产日期180天内专用',
    image: 'https://p3.lefile.cn/product/adminweb/2025/04/24/IIZbTjgzVJtC6Dm0eisQupWMq-4564.jpg',
    currentPrice: 299,
    originalPrice: 599,
    discount: 5,
    link: '#',
    desc: '适用机型：小新笔记本系列，本服务提供在购机后7-49个月内，满足保值换新标准，再次购买联想笔记本时，可享受原设备售价相应比例的换新服务，抵扣金额以新机代金券形式发放。第7-25个月，可享受原设备售价6折回收；第26-49个月，可享受原设备售价5折回收。',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '7',
    name: 'Moto Razr 60 Ultra 2年保值换新服务-生产日期90天内专用',
    image: 'https://p4.lefile.cn/product/adminweb/2025/05/15/SngVZ6ikcZAS7w9SmkBmonW8V-1452.jpg',
    currentPrice: 199,
    originalPrice: 599,
    discount: 3.4,
    link: '#',
    desc: '适用机型：Moto Razr 60 Ultra ，本服务提供在购机后7-25个月内，满足保值换新标准，再次购买联想手机时，可享受原设备售价相应比例的换新服务，抵扣金额以新机代金券形式发放。第7-13个月，可享受原设备售价6折回收；第14-25个月，可享受原设备售价5折回收。',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '8',
    name: '多品牌台式机上门深度拆机清洁-含硅脂',
    image: 'https://p2.lefile.cn/product/adminweb/2024/05/08/rYBarzOGvkfpSxy35bgFMWH2O-5745.jpg',
    currentPrice: 179,
    originalPrice: 189,
    discount: 9.5,
    link: '#',
    desc: '提供由内到外的台式机拆机清洁保养服务，包括涂抹CPU散热硅脂，清洁风扇，清洁显卡，清洁内存，表面外观清洁，购买后请联系客服预约服务时间。注：清洁设备如果包含灯效或水冷功能，需要额外支付灯效和水冷80元清洁费用',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '9',
    name: '联想一键服务鼠标M25 黑色 无线版',
    image: 'https://p1.lefile.cn/product/adminweb/2024/06/04/2h2Wbnm2ttQwMhmrYnW7O8lht-0777.jpg',
    currentPrice: 39,
    originalPrice: 49,
    discount: 8,
    link: '#',
    desc: '无线连接，安静按键，长久续航，简约便携，舒适握感，一键呼叫工程师',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '10',
    name: '联想拯救者Y7000P 2025 16英寸电竞游戏笔记本 碳晶黑',
    image: 'https://p3.lefile.cn/product/adminweb/2025/07/24/Vj9LVCUDwo49jK8zRrGmBTVOx-9113.jpg',
    currentPrice: 9299,
    originalPrice: 10299,
    discount: 9.1,
    link: '#',
    desc: '第14代智能英特尔®酷睿™ i7-14650HX/Windows 11 家庭中文版/16英寸/16GB/1T SSD/RTX™ 5060 8G独显/碳晶黑',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '11',
    name: '联想YOGA Book 9 AI元启 13.3英寸双屏360度翻转电脑 雾海蓝',
    image: 'https://p1.lefile.cn/product/adminweb/2025/02/14/AEUBjKmgsbdWEdrEuw7MPAGkn-0287.jpg',
    currentPrice: 10799,
    originalPrice: 19999,
    discount: 5.4,
    link: '#',
    desc: '英特尔酷睿 Ultra 7/Windows 11 家庭中文版/13.3英寸x2/32GB/1T SSD/集成显卡/雾海蓝',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '12',
    name: '联想(Lenovo)小新16 2024款AI高能轻薄笔记本电脑 霜雪银',
    image: 'https://p2.lefile.cn/product/adminweb/2024/09/02/rXtnNQxUDoDMOxUy5Jkr1yPG7-2155.jpg',
    currentPrice: 3799,
    originalPrice: 4399,
    discount: 8.7,
    link: '#',
    desc: '第13代智能英特尔 ® 酷睿™ i5-13420H/Windows 11 家庭中文版/16英寸/16G/512G SSD/集成显卡/霜雪银',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '13',
    name: '联想来酷几寻暴力风扇超级涡轮小型大功率手持超强力吹风机',
    image: 'https://p4.lefile.cn/product/adminweb/2025/05/16/YMmm1Dm3smvuybtfsBtxfgsEs-5228.jpg',
    currentPrice: 169,
    originalPrice: 299,
    discount: 5.7,
    link: '#',
    desc: '暴力涡轮风扇JX-C01丨13万转/分钟丨风速52米/秒丨无刷电机丨降噪设计',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '14',
    name: '联想来酷笔记本电脑支架支撑增高悬空散热升降桌面键盘铝合金架子',
    image: 'https://p3.lefile.cn/product/adminweb/2025/05/16/8mF6ca0kEEGtfPjkoj3f4Db8P-1090.jpg',
    currentPrice: 39.9,
    originalPrice: 59,
    discount: 6.8,
    link: '#',
    desc: '电脑升降支架X15丨人体工学设计丨贴合视线需求丨办公从此更高效丨镂空设计 高效散热',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '15',
    name: '联想来酷磁吸自收纳编织快充数据线Type-C接口加长便携充电线',
    image: 'https://p3.lefile.cn/product/adminweb/2025/05/16/U35TggxRnJYFHV3WJHTlRj480-4791.jpg',
    currentPrice: 39.9,
    originalPrice: 49,
    discount: 8.2,
    link: '#',
    desc: '磁吸快充数据线CB6MCC丨快充快传丨1m线长丨轻巧便携',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '16',
    name: '【3C认证】联想来酷充电宝大容量9600毫安磁吸便携自带线移动电源',
    image: 'https://p2.lefile.cn/product/adminweb/2025/05/16/aQxrLRGaHD104ZKKckHPzNBMD-1520.jpg',
    currentPrice: 239.9,
    originalPrice: 299,
    discount: 8.1,
    link: '#',
    desc: '磁吸自带线充电宝组合PBF2丨双线快充丨双机CP共享丨自带充电仓',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '17',
    name: '联想来酷25W氮化镓充电器PD多口快充',
    image: 'https://p1.lefile.cn/product/adminweb/2025/05/16/nwAxZNluafI7y0VsXEpJqFna7-7090.jpg',
    currentPrice: 39,
    originalPrice: 59,
    discount: 6.7,
    link: '#',
    desc: '25W氮化镓便携快充充电器CH25丨广泛兼容丨插脚可折叠丨低温快充更安全',
    soldCount: 0,
    totalCount: 10
  },
  {
    id: '18',
    name: 'Lecoo 联想来酷无线鼠标 WM201（黑色）',
    image: 'https://p4.lefile.cn/product/adminweb/2025/04/08/fSvveiwEmAJDW7iHTuPbqxCl6-1054.jpg',
    currentPrice: 59.9,
    originalPrice: 69,
    discount: 8.7,
    link: '#',
    desc: '无线鼠标WM201丨无线2.4G丨贴合手掌丨即插即用丨轻巧便携',
    soldCount: 0,
    totalCount: 10
  }
];


// 2. 场次配置 (Session Configuration)  定义每天的秒杀时间点和分配的商品
const MOCK_SESSIONS: flashSaleMenu[] = [
  {
    id: 's1',
    time: '2025-11-29-00-00-00', 
    duration: '12h',
    products: MOCK_PRODUCTS,
  },
  {
    id: 's2',
    time: '2025-12-01-12-00-00', 
    duration: '24h',
    products: MOCK_PRODUCTS,
  }
];


// 3. 组件逻辑实现
const FlashSaleDetail: React.FC = () => {
  const [activeSession, setActiveSession] = useState<flashSaleMenu>(MOCK_SESSIONS[1]);

  /**
   * 处理场次切换事件
   * @param session 被点击的场次对象
   */
  const handleTabChange = (session: flashSaleMenu) => {
    setActiveSession(session);
  };

  // 实时计算当前选中场次的状态 ('start' | 'end' | 'wait')
  const currentStatus = getSessionStatus(activeSession.time, activeSession.duration);

  return (
    <>
      {/* 顶部红色 Banner 区域 */}
      <FlashHeader />
      
      {/* 场次切换栏 (吸顶悬浮 + 倒计时) */}
      <FlashSessionBar 
        sessions={MOCK_SESSIONS} 
        activeSession={activeSession} 
        onTabChange={handleTabChange} 
      />
      
      {/* 商品列表区域 */}
      <div className="w-[1200px] mx-auto mt-[30px]">
        {/* 将当前场次的商品列表和计算出的状态传递给列表组件 */}
        <FlashProductList 
           products={activeSession.products} 
           status={currentStatus} 
        />
      </div>
    </>
  );
};

export default FlashSaleDetail;