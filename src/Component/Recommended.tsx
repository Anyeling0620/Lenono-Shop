/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-22 00:08:18
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-22 00:16:59
 * @FilePath: \lenovo-shop\src\Component\Recommended.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import FlashSale from "./FlashSale";



/**
 * 推荐商品组件
 * 该组件用于展示推荐商品，目前包含一个限时特卖模块
 */
const Recommended= () => {
    return (
        <>
          <div className="bg-gray-100 py-2">
            <FlashSale></FlashSale>
          </div>
        </>
    )
}

export default Recommended;