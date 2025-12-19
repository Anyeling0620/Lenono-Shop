import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import MainLayout from "./component/Layout/MainLayout"
import NotFound from "./pages/404"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "./context/CartContext"
import UserLayout from "./component/Layout/UserLayout"
import ProtectedRoute, { HavingLoginRoute } from "./component/ProtectedRoute"
import useAuthLifecycle from "./hooks/useAuthLifecycle"
import { WebSocketProvider } from "./services/ws/WebSocketProvider"

// 懒加载页面组件
const Login = lazy(() => import("./pages/Auth/Login"))
const Register = lazy(() => import("./pages/Auth/Register"))
const Index = lazy(() => import("./pages/Index"))
const NewProduct = lazy(() => import("./pages/NewProduct"))
const Search = lazy(() => import("./pages/Search"))
const FlashSalePage = lazy(() => import("./pages/FlashSalePage"))
const ProductDetail = lazy(() => import("./pages/ProductDetail"))
const ShoppingCart = lazy(() => import("./pages/ShoppingCart"))
const Checkout = lazy(() => import("./pages/Checkout"))
const MyOrder = lazy(() => import("./pages/MyOrder"))
const Product = lazy(() => import("./pages/Product"))
const UserCenter = lazy(() => import("./pages/UserCenter"))
const ConsultList = lazy(() => import("./component/UserCenterPages/ConsultList"))
const MyConsult = lazy(() => import("./component/UserCenterPages/MyConsult"))

// 加载中组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-gray-500">加载中...</div>
  </div>
)

/**
 * App组件：应用程序的主要组件，负责路由配置和布局
 * 包含了页面路由和Toaster提示组件的配置
 */
function App() {

  useAuthLifecycle()  // 登陆状态生命周期

  return (
    <main>
      <WebSocketProvider> {/* websocket全局工具上下文 */}
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false}
            toastOptions={{
              style: {}
            }} />{/* 全局消息 */}

          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="index" element={<Index />} />
                <Route path='login' element={<HavingLoginRoute ><Login /></HavingLoginRoute>} />
                <Route path='register' element={<HavingLoginRoute ><Register /></HavingLoginRoute>} />
                <Route path='products/:type' element={<Product />} />
                <Route path="new-product" element={<NewProduct />} />
                <Route path="search" element={<Search />} />
                <Route path="flash-sale" element={<FlashSalePage />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="shopping-cart" element={<ShoppingCart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="my-consult/:customerId" element={<MyConsult />} />
                <Route path="my-order" element={<ProtectedRoute redirectTo={"/login"}><MyOrder /></ProtectedRoute>} />
              </Route>

              <Route element={<UserLayout />}>
                <Route path="user-center" element={<ProtectedRoute redirectTo={"/index"} ><UserCenter /></ProtectedRoute>} />
                <Route path="consult" element={<ConsultList />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </WebSocketProvider>
    </ main>
  )
}

export default App