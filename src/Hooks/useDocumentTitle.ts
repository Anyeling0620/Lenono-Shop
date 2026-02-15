import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

type TitleOptions = {
  /** 品牌/站点名，会以“页面名 - siteName”的形式拼接 */
  siteName?: string
  /** 找不到匹配项时的兜底标题（不包含 siteName 拼接） */
  fallback?: string
}

/**
 * 根据当前路由自动设置浏览器标签页标题。
 *
 * 优先级：
 * 1) React Router v6.4+ 的 route handle.title（若项目未来升级 Data Router，可直接复用）
 * 2) 通过 pathname 匹配的内置映射（本 hook 内维护）
 * 3) fallback
 */
export default function useDocumentTitle(options: TitleOptions = {}) {
  const { fallback = 'lenovo-shop' } = options

  const location = useLocation()

  // 当前项目使用 BrowserRouter + <Routes>（非 Data Router），因此不从 route handle 读取 title。
  // 若未来迁移到 createBrowserRouter，可在这里再接入 handle.title 逻辑。
  const titleFromHandle = ''

  const titleFromPathname = useMemo(() => {
    const p = location.pathname

    if (p === '/' || p === '/index') return '首页'
    if (p === '/login') return '登录'
    if (p === '/register') return '注册'
    if (p.startsWith('/products/')) return '商品列表'
    if (p === '/more-products') return '更多商品'
    if (p === '/new-product') return '新品专区'
    if (p === '/search') return '搜索'
    if (p === '/flash-sale') return '限时秒杀'
    if (p.startsWith('/product/')) return '商品详情'
    if (p === '/shopping-cart') return '购物车'
    if (p === '/checkout') return '结算'
    if (p.startsWith('/my-consult/')) return '我的咨询'
    if (p === '/my-order') return '我的订单'
    if (p === '/coupon-center') return '领券中心'
    if (p === '/order/payment') return '订单支付'
    if (p.startsWith('/order-detail/')) return '订单详情'
    if (p.startsWith('/after-sale/')) return '售后'
    if (p === '/evaluate') return '订单评价'
    if (p === '/user-center') return '个人中心'
    if (p === '/consult') return '咨询'

    return ''
  }, [location.pathname])

  const finalTitle = useMemo(() => {
  const pageTitle = titleFromHandle || titleFromPathname || fallback
  // 按需求：仅显示页面标题，不在后面拼接站点名
  return pageTitle
  }, [fallback, titleFromHandle, titleFromPathname])

  useEffect(() => {
    document.title = finalTitle
  }, [finalTitle])
}
