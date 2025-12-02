/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-27 20:26:40
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-27 23:14:31
 * @FilePath: \lenovo-shop\src\types\searchProduct.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
export interface Product { /** * 产品接口定义 * 描述了一个产品的基本信息和属性 */
    id: string; //  产品唯一标识符
    name: string; //  产品名称
    description: string; //  产品描述
    image: string; //  产品图片链接
    currentPrice: number; //  当前价格
    isDiscount: boolean; //  是否处于折扣状态
    originalPrice: number; //  原始价格
    tags: { //  产品标签信息
        self?: boolean; //  自营标签
        coupon?: { money: number }; //  优惠券标签，包含优惠金额
        custom?: boolean; //  自定义标签
        tradeIn?: boolean; //  以旧换新标签
        installment?: { month: number }; //  分期付款标签，包含分期月数
    };
    link: string;
}