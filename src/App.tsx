import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import MainLayout from "./component/Layout/MainLayout"
import NotFound from "./pages/404"
import { Toaster } from "react-hot-toast"
import UserLayout from "./component/Layout/UserLayout"
import ProtectedRoute, { HavingLoginRoute } from "./component/ProtectedRoute"
import useAuthLifecycle from "./hooks/useAuthLifecycle"
import { WebSocketProvider } from "./services/ws/WebSocketProvider"
import { LoadingFallback } from "./component/LoadingFallback"
import CouponCenter from "./pages/CouponCenter"
import PayPage from "./pages/PayPage"
import OrderDetail from "./pages/OrderDetail"
import AfterSaleApply from "./pages/AfterSaleApply"
import ComplaintPage from "./pages/ComplaintPage"
import EvaluationPage from "./pages/EvaluationPage"
import AfterSaleDetailPage from "./pages/AfterSaleDetail"
import useDocumentTitle from "./hooks/useDocumentTitle"

// 懒加载页面组件
const Login = lazy(() => import("./pages/Auth/Login"))
  useDocumentTitle({ siteName: 'lenovo-shop' })
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
const MoreProducts = lazy(() => import("./pages/MoreProducts"))


function App() {
  useAuthLifecycle()  // 登陆状态生命周期
  return (
    <main>
      <WebSocketProvider> {/* websocket全局工具上下文 */}
        <Toaster position="top-center" reverseOrder={false}
          toastOptions={{
            style: {}
          }} />

        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="index" element={<Index />} />
              <Route path='login' element={<HavingLoginRoute ><Login /></HavingLoginRoute>} />
              <Route path='register' element={<HavingLoginRoute ><Register /></HavingLoginRoute>} />
              <Route path='products/:type' element={<Product />} />
              <Route path='more-products' element={<MoreProducts />} />
              <Route path="new-product" element={<NewProduct />} />
              <Route path="search" element={<Search />} />
              <Route path="flash-sale" element={<FlashSalePage />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="shopping-cart" element={<ProtectedRoute redirectTo={"/login"}><ShoppingCart /></ProtectedRoute>} />
              <Route path="checkout" element={<ProtectedRoute redirectTo={"/login"}><Checkout /></ProtectedRoute>} />
              <Route path="my-consult/:customerId" element={<ProtectedRoute redirectTo={"/login"}><MyConsult /></ProtectedRoute>} />
              <Route path="my-order" element={<ProtectedRoute redirectTo={"/login"}><MyOrder /></ProtectedRoute>} />
              <Route path="coupon-center" element={<CouponCenter />}></Route>
              <Route path='order/payment' element={<ProtectedRoute redirectTo={"/login"}><PayPage /></ProtectedRoute>} />
              <Route path="order-detail/:id" element={<ProtectedRoute redirectTo="/login"><OrderDetail /></ProtectedRoute>} />
              <Route path="after-sale/:id" element={<ProtectedRoute redirectTo="/login"><AfterSaleDetailPage /></ProtectedRoute>} />
              <Route path="after-sale/apply" element={<ProtectedRoute redirectTo="/login"><AfterSaleApply /></ProtectedRoute>} />
              <Route path="after-sale/complaint" element={<ProtectedRoute redirectTo="/login"><ComplaintPage /></ProtectedRoute>} />
              <Route path="evaluate" element={<ProtectedRoute redirectTo="/login"><EvaluationPage /></ProtectedRoute>} />
            </Route>
            <Route element={<UserLayout />}>
              <Route path="user-center" element={<ProtectedRoute redirectTo={"/index"} ><UserCenter /></ProtectedRoute>} />
              <Route path="consult" element={<ConsultList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </WebSocketProvider>
    </ main>
  )
}

export default App