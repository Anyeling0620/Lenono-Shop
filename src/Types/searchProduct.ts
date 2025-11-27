export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    currentPrice: number;
    isDiscount: boolean;
    originalPrice: number;
    tags: {
        self?: boolean;
        coupon?: { money: number };
        custom?: boolean;
        tradeIn?: boolean;
        installment?: { month: number };
    };
    link: string;
}