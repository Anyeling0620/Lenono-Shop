interface Coupon {
    id: string;
    name: string;
    type: "满减" | "折扣";  // 根据示例数据，type 只能是这两个值之一
    amount: string;        // 金额，使用 string 类型以保持与数据一致
    discount: string;      // 折扣率，使用 string 类型
    threshold: string;     // 使用门槛金额，使用 string 类型
    condition: string;     // 使用条件描述
    scope: string;         // 适用范围
    startTime: string;     // 开始时间，ISO 格式字符串
    expireTime: string;    // 过期时间，ISO 格式字符串
    isStackable: boolean;  // 是否可叠加
    creatorId: string;    // 创建者ID
    createdAt: string;    // 创建时间，ISO 格式字符串
    remark?: string;       // 备注，可选字段
}

export interface CouponItem {
    id: string;
    couponId: string;
    startTime: string;     // 生效时间，ISO 格式字符串
    totalNum: number;      // 总数量
    endTime: string;       // 结束时间，ISO 格式字符串
    limitNum: number;      // 限制数量
    creatorId: string;     // 创建者ID
    createdAt: string;     // 创建时间，ISO 格式字符串
    coupon: Coupon;        // 关联的优惠券详细信息
    received?: boolean; // 用户是否领取
}

export interface CouponCenterListResponse {
  items: CouponItem[];
}




export interface UserCouponItem {
  id: string;               // userCoupon id
  couponId: string;         // coupon id
  status: "未使用" | "已使用" | "已过期"; // 未使用/已使用/已过期等
  receiveTime: string;        // 不做日期格式化
  useTime?: string | null;    // 不做日期格式化
  orderId?: string | null;
  actualAmount: number;     // 折后实减金额
  coupon: {
    id: string;
    name: string;
    type: "满减" | "折扣";
    amount: number;         // 金额类券面额（转 number）
    discount: number;       // 折扣类折扣率（转 number）
    threshold: number;      // 使用门槛（转 number）
    condition?: string | null;
    scope?: string | null;   
    startTime: string;        // 不做日期格式化
    expireTime: string;       // 不做日期格式化
    isStackable: boolean;
  };
  useOK?:boolean;
}

export interface UserCouponListResponse {
  items: UserCouponItem[];
}



export interface UserVoucherItem {
  id: string;              // userVoucher id
  userId: string;
  voucherId: string;
  status: boolean;         // 代金券状态（true 有效/false 失效）
  getTime: string;          
  useUpTime?: string | null; 
  usedAmount: number;      // 已使用金额（number）
  remainAmount: number;    // 剩余金额（number）
  voucher: {
    id: string;
    title: string;
    description?: string | null;
    originalAmount: number; // number
    startTime: string;        // 不做日期格式化
    endTime: string;          // 不做日期格式化
    creatorId: string;
    remark?: string | null;
  };
}

export interface UserVoucherListResponse {
  items: UserVoucherItem[];
}

