import React from 'react';

const FlashSale = () => {
  const products = [
    { id: 1, name: '商品1', price: '5000', discount: '9.9折', image: '商品图片URL' },
    { id: 2, name: '商品2', price: '5000', discount: '9.9折', image: '商品图片URL' },
    { id: 3, name: '商品3', price: '5000', discount: '9.9折', image: '商品图片URL' },
    { id: 4, name: '商品4', price: '5000', discount: '9.9折', image: '商品图片URL' },
  ];

  return (
    <div className="flex w-[80%] h-[500px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* 左侧标题区域 */}
      <div className="w-[20%] h-full bg-red-500 flex items-center justify-center">
        <div className="text-white font-bold text-2xl text-center whitespace-nowrap">
          秒杀专场
        </div>
      </div>
      
      {/* 右侧商品区域 */}
      <div className="flex-1 flex flex-col">
        {/* 场次信息 */}
        <div className="w-full h-[60px] bg-red-500 flex items-center justify-center">
          <div className="font-bold text-lg text-white">12:00场-正在抢购</div>
        </div>
        
        {/* 商品列表 */}
        <div className="flex-1 p-4">
          <ul className="flex justify-between items-stretch h-full space-x-4 list-none">
            {products.map((product) => (
              <li key={product.id} className="flex-1">
                <a 
                  href="https://www.jxutcm.top" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
                >
                  {/* 图片区域 - 占60%高度 */}
                  <div className="h-[60%] p-2 flex items-center justify-center bg-gray-50">
                    <div className="w-full aspect-square bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500">商品图片</span>
                    </div>
                  </div>
                  
                  {/* 商品信息区域 - 占40%高度 */}
                  <div className="h-[40%] p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <div className="text-xs text-red-500 font-bold mb-1">
                        {product.discount}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      ¥{product.price}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
