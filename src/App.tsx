import { Routes, Route } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import MainLayout from "./component/Layout/MainLayout"
import NotFound from "./pages/404"
import NewProduct from "./pages/NewProduct"
import Index from "./pages/Index"
import { Toaster } from "react-hot-toast"
import Search from "./pages/Search"
import FlashSalePage from "./pages/FlashSalePage"
import ProductDetail from "./pages/ProductDetail"
import ShoppingCart from "./pages/ShoppingCart"
import Checkout from "./pages/Checkout"
import { CartProvider } from "./context/CartContext"
import UserCenter from "./pages/UserCenter"
import UserLayout from "./component/Layout/UserLayout"
import ProtectedRoute from "./component/ProtectedRoute"
import useAuthLifecycle from "./hooks/useAuthLifecycle"
import { WebSocketProvider } from "./services/ws/WebSocketProvider"
import ConsultList from "./component/UserCenterPages/ConsultList"
import MyConsult from "./component/UserCenterPages/MyConsult"
import MyOrder from "./pages/MyOrder";
import Product from "./pages/Product"

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

          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="index" element={<Index />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
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
        </CartProvider>
      </WebSocketProvider>
    </ main>
  )
}

export default App