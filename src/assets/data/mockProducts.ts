import type { MainProduct, MainProductCategory } from "../../types/mainProduct";



// 辅助函数：补全详情页数据
// 输入 Partial<MainProduct>，输出完整的 MainProduct
const enrichProduct = (product: Partial<MainProduct> & { id: string; name: string; image: string; originalPrice: number; coupon: number }): MainProduct => {
  const baseImage = product.image;
  
  return {
    // 默认值填充
    features: [],
    customerize: false,
    tradeIn: false,
    link: "",
    ...product, // 覆盖传入的属性

    // 详情页逻辑补全
    subTitle: product.subTitle || product.features?.join(" | ") || "爆款热销",
    gallery: product.gallery || [baseImage, baseImage, baseImage, baseImage],
    detailImages: product.detailImages || [baseImage, baseImage, baseImage],
    currentPrice: product.currentPrice || (product.originalPrice - product.coupon),
    specOptions: product.specOptions || [
        { label: "颜色", values: ["官方标配"] },
        { label: "配置", values: ["标准版", "定制版"] }
    ],
    serviceTags: product.serviceTags || ["联想物流", "7天无理由退货", "分期免息"]
  };
};

// 辅助函数：批量生成商品
const generateProducts = (startIndex: number, categoryName: string, baseImg: string): MainProduct[] => {
  return Array.from({ length: 8 }).map((_, index) => {
    const id = (startIndex + index).toString();
    const price = 2999 + index * 100;
    
    return enrichProduct({
      id: id,
      name: `${categoryName} - 型号${id}`,
      subTitle: "【限时直降】120Hz高刷屏 / 护眼认证",
      features: ["高性能", "长续航", "护眼屏"],
      image: baseImg,
      originalPrice: price + 500,
      currentPrice: price,
      coupon: 500,
      customerize: index % 2 === 0,
      tradeIn: true,
      link: `/product/${id}`,
    });
  });
};

// --- 1. Lenovo 电脑 (手动定义的精细数据) ---
const lenovoLaptops: MainProduct[] = [
  {
    id: "1",
    name: "小新14 酷睿版",
    features: ["50W性能释放", "双内存拓展"],
    image: "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
    originalPrice: 4199,
    coupon: 400,
    customerize: true,
    tradeIn: true,
    link: "/product/1",
    videoUrl: "https://example.com/video/product1.mp4", // 示例视频URL
    stock: 50, // 库存数量
  },
  {
    id: "2",
    name: "小新16 酷睿版",
    features: ["52W性能释放", "双内存拓展"],
    image: "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
    originalPrice: 4399,
    coupon: 400,
    customerize: true,
    tradeIn: true,
    link: "/product/2",
  },
  {
    id: "3",
    name: "小新Pro14GT AI元启版",
    features: ["50W性能释放", "双内存拓展"],
    image: "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
    originalPrice: 6399,
    coupon: 320,
    customerize: true,
    tradeIn: true,
    link: "/product/3",
  },
  {
    id: "4",
    name: "小新Pro16GT AI元启版",
    features: ["52W性能释放", "双内存拓展"],
    image: "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
    originalPrice: 6699,
    coupon: 400,
    customerize: true,
    tradeIn: true,
    link: "/product/4",
  },
  {
    id: "5",
    name: "拯救者Y9000P 2025至尊版",
    features: ["50W性能释放", "双内存拓展"],
    image: "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
    originalPrice: 29499,
    coupon: 0,
    customerize: true,
    tradeIn: true,
    link: "/product/5",
  },
  {
    id: "6",
    name: "白金独角兽限定Y9000P至尊",
    features: ["52W性能释放", "双内存拓展"],
    image: "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
    originalPrice: 23099,
    coupon: 200,
    customerize: true,
    tradeIn: true,
    link: "/product/6",
  },
  {
    id: "7",
    name: "拯救者Y9000P 2025 AI元启",
    features: ["50W性能释放", "双内存拓展"],
    image: "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
    originalPrice: 12699,
    coupon: 700,
    customerize: false,
    tradeIn: true,
    link: "/product/7",
  },
  {
    id: "8",
    name: "拯救者Y7000P 2025",
    features: ["52W性能释放", "双内存拓展"],
    image: "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
    originalPrice: 9999,
    coupon: 0,
    customerize: true,
    tradeIn: true,
    link: "/product/8",
  },
].map(enrichProduct);

// --- 2. Lenovo 台式机 ---
const desktopImg = "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg";
const lenovoDesktops: MainProduct[] = generateProducts(11, "GeekPro G5000", desktopImg);

// --- 3. ThinkPad 电脑 ---
const thinkpadImg = "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg";
const thinkpads: MainProduct[] = generateProducts(21, "ThinkPad X1", thinkpadImg);


// --- 导出强类型数据 ---
export const productCategories: MainProductCategory[] = [
  {
    category: "Lenovo 电脑",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "/search?q=lenovo",
        alt: '图片1'
      },
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "/search?q=lenovo",
        alt: '图片2'
      }
    ],
    products: lenovoLaptops,
  },
  {
    category: "Lenovo 台式机",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "/search?q=desktop",
        alt: '台式机推荐'
      },
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "/search?q=desktop",
        alt: '台式机活动'
      }
    ],
    products: lenovoDesktops,
  },
  {
    category: "ThinkPad 电脑",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "/search?q=thinkpad",
        alt: 'ThinkPad推荐'
      },
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "/search?q=thinkpad",
        alt: 'ThinkPad活动'
      }
    ],
    products: thinkpads,
  },
];

// 查找辅助函数（现在不需要 :any 了，TS 能自动推断）
export const findProductById = (id: string): MainProduct | null => {
    for (const category of productCategories) {
        const found = category.products.find((p) => p.id === id);
        if (found) return found;
    }
    return null;
};