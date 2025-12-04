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


/**
 * App组件：应用程序的主要组件，负责路由配置和布局
 * 包含了页面路由和Toaster提示组件的配置
 */
function App() {
  return (

    <main>
      <Toaster position="top-center" reverseOrder={false}
        toastOptions={{
          style: {}
        }} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="index" element={<Index />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='new-product' element={<NewProduct />} />
          <Route path="search" element={<Search />} />
          <Route path="flash-sale" element={<FlashSalePage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="shopping-cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route path="user-center" element={<UserCenter />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
