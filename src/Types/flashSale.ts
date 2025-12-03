/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-25 21:58:51
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-25 23:33:40
 * @FilePath: \lenovo-shop\src\types\flashSale.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
export type TimeStatus = 'start' | 'end' | 'wait';

export interface TimeInfo { /** * 时间信息接口，包含时间状态、会话标识和时间信息 */
  session: string; //  会话标识符
  duration: string; //  持续时长 nh
  time: string;   // 日期 格式为 YYYY-MM-DD-HH-mm-ss
}

export interface Product { /** * 产品接口，定义了商品相关的属性 */
  id: string; //  产品唯一标识符
  name: string; //  产品名称
  image: string; //  产品图片链接
  currentPrice: number; //  当前价格
  originalPrice: number; //  原始价格
  discount: number; //  折扣
  link: string; //  产品链接

  desc?: string;          // 商品描述
  soldPercent?: number;   // 已抢进度 (0-100)
}

export interface flashSaleMenu {
  id: string; //  会话唯一标识符    if id = ""
  time: string; //  会话时间
  duration: string; //  会话时长
  products: Product[]; //  产品列表

  statusOverride?: TimeStatus; // 用于强制指定状态(测试用)
  countdown?: string;          // 详情页倒计时文案
}

export interface TimeUnit {
  hours: string;
  minutes: string;
  seconds: string;
}