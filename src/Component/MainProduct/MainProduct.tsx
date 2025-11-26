import type { MainProductCategory } from "../../types/mainProduct";
import Category from "./MainProductCategory";

const productCategories: MainProductCategory[] = [
  {
    category: "Lenovo 电脑",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "Lenovo 台式机",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "ThinkPad 电脑",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "手机&配件",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "平板电脑",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "选件",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "服务/配件",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "智能",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "显示器",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "IP周边",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  },
  {
    category: "thinkplus",
    image: [
      {
        imageName: "https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片1'
      }, 
      {
       imageName: "https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg",
        linkUrl: "https://www.lenovo.com.cn/",
        alt: '图片2'
      }
    ],
    products: [
      {
        id: "1",
        name: "小新14 酷睿版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4199,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044702.html",
      },
      {
        id: "2",
        name: "小新16 酷睿版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg",
        originalPrice: 4399,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044582.html",
      },
      {
        id: "3",
        name: "小新Pro14GT AI元启版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6399,
        coupon: 320,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042860.html",
      },
      {
        id: "4",
        name: "小新Pro16GT AI元启版",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p1.lefile.cn/fes/cms/2025/11/14/5zj580fsiaa20cw4skv1qyp76wrcg3614837.jpg",
        originalPrice: 6699,
        coupon: 400,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1042858.html",
      },
      {
        id: "5",
        name: "拯救者Y9000P 2025至尊版",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 29499,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1044631.html",
      },
      {
        id: "6",
        name: "白金独角兽限定Y9000P至尊",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/kzjdwhowruful3sqkl4stsp14vcfdt399792.jpg",
        originalPrice: 23099,
        coupon: 200,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045340.html",
      },
      {
        id: "7",
        name: "拯救者Y9000P 2025 AI元启",
        features: ["50W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/4vku6le0xyp1iehjjejuwfmqkhw0tc157633.jpg",
        originalPrice: 12699,
        coupon: 700,
        customerize: false,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1045454.html",
      },
      {
        id: "8",
        name: "拯救者Y7000P 2025",
        features: ["52W性能释放", "双内存拓展"],
        image:
          "https://p3.lefile.cn/fes/cms/2025/11/14/f3l5ag3sx53qptmfrnhmgd0m3m7pd0385062.jpg",
        originalPrice: 9999,
        coupon: 0,
        customerize: true,
        tradeIn: true,
        link: "https://item.lenovo.com.cn/product/1046111.html",
      },
    ],
  }
];

/**
 * MainProduct 组件
 * 这是一个主产品展示组件，用于展示主要内容区域
 * @returns {JSX.Element} 返回一个具有特定样式的React组件
 */
const MainProduct = () => {
  return (
    <div className="relative w-[1200px] mx-auto my-0">
      {/* 内部容器，设置上下内边距，为内容提供空间 */}
      {productCategories.map((category) => (
        <Category
          key={category.category}
          name={category.category}
          image={category.image}
          products={category.products}
        />
      ))}
    </div>
  );
};

export default MainProduct;
