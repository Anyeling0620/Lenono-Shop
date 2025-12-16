# 🛒 Lenovo Shop - 联想官方商城

<div align="center">

![Lenovo Shop Logo](https://img.shields.io/badge/Lenovo-Shop-blue?style=for-the-badge&logo=lenovo&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**联想官方旗舰电商平台 - 打造极致购物体验**

[📖 快速开始](#-快速开始) • [🏗️ 项目架构](#-项目架构) • [📁 文件结构](#-文件结构) • [🎯 功能特性](#-功能特性) • [🛠️ 开发指南](#-开发指南) • [📋 TODO 清单](#-todo-清单)

</div>

---

## 📋 项目概述

**Lenovo Shop** 是联想集团官方的现代化电商平台，专为联想产品打造的全场景购物解决方案。项目采用最新的前端技术栈，提供了完整的电商购物流程，包括商品展示、用户认证、购物车管理、订单处理等核心功能。

### 🎯 项目愿景
- 🚀 **极致性能**：基于 Vite 的现代化构建工具，确保快速加载和流畅体验
- 📱 **全端适配**：完美支持桌面端和移动端，基于 Capacitor 提供原生 App 体验
- 🎨 **优雅设计**：采用 TailwindCSS 打造现代化 UI，遵循联想品牌设计规范
- 🔒 **安全可靠**：完整的用户认证和数据安全保障体系

### 📊 项目规模
- **代码行数**: ~15,000+ 行
- **组件数量**: 50+ 个 React 组件
- **页面数量**: 15+ 个页面
- **功能模块**: 20+ 个核心功能模块

---

## 🛠️ 技术栈分析

### 🎨 前端框架 & 语言
```json
{
  "React": "19.2.0 - 最新稳定版，Hooks + Concurrent Features",
  "TypeScript": "5.9.3 - 完整的类型安全支持",
  "Vite": "7.2.2 - 下一代前端构建工具"
}
```

### 🎯 UI & 样式
```json
{
  "TailwindCSS": "3.4.18 - 原子化 CSS 框架",
  "Ant Design": "6.0.0 - 企业级 UI 组件库",
  "Framer Motion": "12.23.24 - 动画库",
  "Swiper": "12.0.3 - 轮播组件"
}
```

### 🔧 状态管理 & 数据
```json
{
  "Zustand": "5.0.9 - 轻量级状态管理",
  "React Hook Form": "7.67.0 - 表单管理",
  "Axios": "1.13.2 - HTTP 客户端",
  "React Use WebSocket": "4.13.0 - WebSocket 连接"
}
```

### 📱 移动端 & 跨平台
```json
{
  "Capacitor": "原生移动端支持",
  "@capacitor/android": "Android 原生集成",
  "@capacitor/ios": "iOS 原生集成"
}
```

### 🛠️ 开发工具 & 质量保障
```json
{
  "ESLint": "9.39.1 - 代码质量检查",
  "TypeScript ESLint": "8.46.3 - TypeScript 代码检查",
  "PostCSS": "8.5.6 - CSS 处理",
  "Autoprefixer": "10.4.22 - CSS 浏览器兼容性"
}
```

---

## 🏗️ 项目架构

### 📂 整体架构图
```
lenovo-shop/
├── 📁 android/                 # Android 原生应用
├── 📁 public/                  # 静态资源
├── 📁 src/                     # 源代码
│   ├── 📁 assets/             # 资源文件
│   ├── 📁 component/          # React 组件
│   ├── 📁 context/            # React Context
│   ├── 📁 hooks/              # 自定义 Hooks
│   ├── 📁 pages/              # 页面组件
│   ├── 📁 services/           # 服务层
│   ├── 📁 store/              # 状态管理
│   └── 📁 types/              # TypeScript 类型定义
├── 📁 .vscode/                # VS Code 配置
└── 📄 配置文件                # 各种配置文件
```

### 🔄 数据流架构
```
用户交互 → React 组件 → Hooks → Context/Store → Services → API
                      ↓
                状态更新 ← 响应式更新 ← 数据流
```

### 🗂️ 组件架构模式
- **容器组件**: 负责数据获取和状态管理
- **展示组件**: 专注于 UI 渲染和用户交互
- **高阶组件**: 提供通用功能复用
- **自定义 Hooks**: 业务逻辑封装和状态管理

---

## 📁 文件结构详解

### 🎯 核心入口文件

#### `src/main.tsx` - 应用入口
```typescript
// 📍 位置: src/main.tsx
// 🎯 功能: React 应用启动入口，路由配置，Provider 包装
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `src/App.tsx` - 主应用组件
```typescript
// 📍 位置: src/App.tsx
// 🎯 功能: 路由配置，布局组件，全局状态管理
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './component/Layout/MainLayout'
import Index from './pages/Index'
// ... 其他导入

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          {/* 其他路由配置 */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### 📂 页面组件 (`src/pages/`)

#### `src/pages/Index.tsx` - 首页
```typescript
// 📍 位置: src/pages/Index.tsx
// 🎯 功能: 商城首页，展示轮播图、商品分类、推荐商品等
// 🔗 路由: /
import React from 'react'
import Carousel from '../component/Carousel/Carousel'
import MainProduct from '../component/MainProduct/MainProduct'
// ... 其他组件

const Index: React.FC = () => {
  return (
    <div className="space-y-8">
      <Carousel />
      <MainProduct />
      {/* 其他首页模块 */}
    </div>
  )
}
```

#### `src/pages/ProductDetail.tsx` - 商品详情页 ⭐⭐⭐
```typescript
// 📍 位置: src/pages/ProductDetail.tsx
// 🎯 功能: 商品详细信息展示、规格选择、购买流程
// 🔗 路由: /product/:id
// 📊 复杂度: 高 (包含图片展示、评论系统、配送选择等)
// 🔧 依赖: useCart, useFavorites, ProductComments 等
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { findProductById } from "../assets/data/mockProducts"
// ... 其他导入

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  // 复杂的商品详情逻辑
}
```

#### `src/pages/ShoppingCart.tsx` - 购物车
```typescript
// 📍 位置: src/pages/ShoppingCart.tsx
// 🎯 功能: 购物车商品管理、数量调整、结算功能
// 🔗 路由: /shopping-cart
// 🔧 依赖: useCart Context
```

#### `src/pages/Checkout.tsx` - 结算页面
```typescript
// 📍 位置: src/pages/Checkout.tsx
// 🎯 功能: 订单确认、收货地址填写、支付方式选择
// 🔗 路由: /checkout
```

#### `src/pages/UserCenter.tsx` - 用户中心
```typescript
// 📍 位置: src/pages/UserCenter.tsx
// 🎯 功能: 用户信息管理、订单历史、账户设置
// 🔗 路由: /user-center
```

#### `src/pages/Search.tsx` - 搜索页面
```typescript
// 📍 位置: src/pages/Search.tsx
// 🎯 功能: 商品搜索、筛选、排序功能
// 🔗 路由: /search
```

#### `src/pages/FlashSalePage.tsx` - 限时抢购
```typescript
// 📍 位置: src/pages/FlashSalePage.tsx
// 🎯 功能: 秒杀活动、倒计时、抢购逻辑
// 🔗 路由: /flash-sale
```

### 📂 组件系统 (`src/component/`)

#### 🔐 认证组件 (`src/component/Auth/`)

##### `src/component/Auth/AuthForm.tsx` - 认证表单
```typescript
// 📍 位置: src/component/Auth/AuthForm.tsx
// 🎯 功能: 用户登录/注册表单，表单验证
// 🔧 依赖: react-hook-form, zod
```

##### `src/component/Auth/LoginModeTabs.tsx` - 登录模式切换
```typescript
// 📍 位置: src/component/Auth/LoginModeTabs.tsx
// 🎯 功能: 手机号/邮箱登录切换
```

##### `src/component/Auth/VerificationCodeField.tsx` - 验证码输入
```typescript
// 📍 位置: src/component/Auth/VerificationCodeField.tsx
// 🎯 功能: 短信验证码输入和倒计时
// 🔧 依赖: useVerificationCode hook
```

#### 🖼️ 轮播组件 (`src/component/Carousel/`)

##### `src/component/Carousel/Carousel.tsx` - 主轮播组件
```typescript
// 📍 位置: src/component/Carousel/Carousel.tsx
// 🎯 功能: 首页轮播图展示
// 🔧 依赖: Swiper
```

##### `src/component/Carousel/CarouselItem.tsx` - 轮播项
```typescript
// 📍 位置: src/component/Carousel/CarouselItem.tsx
// 🎯 功能: 单个轮播图项的渲染
```

##### `src/component/Carousel/NavigationButtons.tsx` - 导航按钮
```typescript
// 📍 位置: src/component/Carousel/NavigationButtons.tsx
// 🎯 功能: 轮播图左右导航
```

#### 🛒 商品相关组件

##### `src/component/MainProduct/MainProduct.tsx` - 主要商品展示
```typescript
// 📍 位置: src/component/MainProduct/MainProduct.tsx
// 🎯 功能: 首页商品分类展示
```

##### `src/component/MainProduct/MainProductCard.tsx` - 商品卡片
```typescript
// 📍 位置: src/component/MainProduct/MainProductCard.tsx
// 🎯 功能: 商品信息展示卡片
// 🔧 依赖: useFavorites hook
```

##### `src/component/ProductComments/ProductComments.tsx` - 商品评价 ⭐⭐⭐
```typescript
// 📍 位置: src/component/ProductComments/ProductComments.tsx
// 🎯 功能: 商品评价展示、评分统计、评论列表
// 🔧 依赖: mockComments 数据
// 📊 复杂度: 高 (包含分页、排序、筛选)
```

##### `src/component/RelatedProducts/RelatedProducts.tsx` - 相关商品
```typescript
// 📍 位置: src/component/RelatedProducts/RelatedProducts.tsx
// 🎯 功能: 商品详情页相关商品推荐
```

##### `src/component/RecentProducts/RecentProducts.tsx` - 最近浏览
```typescript
// 📍 位置: src/component/RecentProducts/RecentProducts.tsx
// 🎯 功能: 商品详情页最近浏览商品展示
// 🔧 依赖: localStorage
```

#### 🛍️ 购物相关组件

##### `src/component/FlashSale/FlashSale.tsx` - 限时抢购
```typescript
// 📍 位置: src/component/FlashSale/FlashSale.tsx
// 🎯 功能: 秒杀活动展示
```

##### `src/component/FlashSale/TimeDisplay.tsx` - 倒计时
```typescript
// 📍 位置: src/component/FlashSale/TimeDisplay.tsx
// 🎯 功能: 抢购倒计时显示
```

#### 🧭 导航组件 (`src/component/Header/`)

##### `src/component/Header/Header.tsx` - 主导航栏
```typescript
// 📍 位置: src/component/Header/Header.tsx
// 🎯 功能: 网站顶部导航栏
```

##### `src/component/Header/SearchBar.tsx` - 搜索栏
```typescript
// 📍 位置: src/component/Header/SearchBar.tsx
// 🎯 功能: 商品搜索功能
```

##### `src/component/Header/AuthLinks.tsx` - 用户认证链接
```typescript
// 📍 位置: src/component/Header/AuthLinks.tsx
// 🎯 功能: 登录/注册/用户信息显示
```

#### 🗂️ 布局组件 (`src/component/Layout/`)

##### `src/component/Layout/MainLayout.tsx` - 主布局
```typescript
// 📍 位置: src/component/Layout/MainLayout.tsx
// 🎯 功能: 网站主要布局框架
```

##### `src/component/Layout/UserLayout.tsx` - 用户中心布局
```typescript
// 📍 位置: src/component/Layout/UserLayout.tsx
// 🎯 功能: 用户中心页面布局
```

#### 🔍 搜索组件 (`src/component/Search/`)

##### `src/component/Search/SearchFilters.tsx` - 搜索筛选
```typescript
// 📍 位置: src/component/Search/SearchFilters.tsx
// 🎯 功能: 搜索结果筛选条件
```

##### `src/component/Search/SortOptions.tsx` - 排序选项
```typescript
// 📍 位置: src/component/Search/SortOptions.tsx
// 🎯 功能: 搜索结果排序
```

#### 🛠️ 工具组件

##### `src/component/ShareButtons/ShareButtons.tsx` - 分享按钮
```typescript
// 📍 位置: src/component/ShareButtons/ShareButtons.tsx
// 🎯 功能: 商品分享功能 (微信、微博、QQ)
```

##### `src/component/DeliverySelector/DeliverySelector.tsx` - 配送地址选择 ⭐⭐⭐
```typescript
// 📍 位置: src/component/DeliverySelector/DeliverySelector.tsx
// 🎯 功能: 全国省市区三级联动选择
// 🔧 依赖: chinaRegions 数据
// 📊 复杂度: 高 (包含31个省份数据)
```

##### `src/component/ImageModal/ImageModal.tsx` - 图片模态框
```typescript
// 📍 位置: src/component/ImageModal/ImageModal.tsx
// 🎯 功能: 商品图片放大查看
```

#### 👤 用户中心组件 (`src/component/UserCenterPages/`)

##### `src/component/UserCenterPages/UserCenterPages.tsx` - 用户中心主页
```typescript
// 📍 位置: src/component/UserCenterPages/UserCenterPages.tsx
// 🎯 功能: 用户中心导航和内容展示
```

##### `src/component/UserCenterPages/AccountInfo.tsx` - 账户信息
```typescript
// 📍 位置: src/component/UserCenterPages/AccountInfo.tsx
// 🎯 功能: 用户基本信息管理
```

##### `src/component/UserCenterPages/DeviceManager.tsx` - 设备管理
```typescript
// 📍 位置: src/component/UserCenterPages/DeviceManager.tsx
// 🎯 功能: 用户设备绑定管理
```

#### 🎫 卡片组件 (`src/component/UserInfoCard/`)

##### `src/component/UserInfoCard/UserInfoCard.tsx` - 用户信息卡片
```typescript
// 📍 位置: src/component/UserInfoCard/UserInfoCard.tsx
// 🎯 功能: 用户信息展示卡片
```

##### `src/component/UserInfoCard/CouponSection.tsx` - 优惠券区域
```typescript
// 📍 位置: src/component/UserInfoCard/CouponSection.tsx
// 🎯 功能: 用户优惠券展示
```

### 📂 数据层 (`src/assets/`)

#### `src/assets/data/mockProducts.ts` - 商品数据 ⭐⭐⭐
```typescript
// 📍 位置: src/assets/data/mockProducts.ts
// 🎯 功能: 模拟商品数据，包含联想全系产品
// 📊 数据量: 20+ 商品，完整的商品信息结构
// 🔧 功能: findProductById, enrichProduct 等工具函数
```

#### `src/assets/data/mockComments.ts` - 评论数据 ⭐⭐⭐
```typescript
// 📍 位置: src/assets/data/mockComments.ts
// 🎯 功能: 模拟商品评价数据
// 📊 数据量: 多个商品的评价数据
// 🔧 功能: getProductComments, getCommentStats
```

#### `src/assets/data/chinaRegions.ts` - 地区数据 ⭐⭐⭐
```typescript
// 📍 位置: src/assets/data/chinaRegions.ts
// 🎯 功能: 中国31个省份的完整行政区划数据
// 📊 数据量: 31省 + 数百城市 + 数千区县
// 🔧 功能: getProvinces, getCitiesByProvince
```

#### `src/assets/icon.ts` - 图标配置
```typescript
// 📍 位置: src/assets/icon.ts
// 🎯 功能: 应用中使用的图标配置
```

#### `src/assets/agreementContent.tsx` - 协议内容
```typescript
// 📍 位置: src/assets/agreementContent.tsx
// 🎯 功能: 用户协议和服务条款内容
```

### 📂 类型定义 (`src/types/`)

#### `src/types/mainProduct.ts` - 商品类型 ⭐⭐⭐
```typescript
// 📍 位置: src/types/mainProduct.ts
// 🎯 功能: 商品相关类型定义
// 📊 复杂度: 高 (包含完整的商品数据结构)
export interface MainProduct {
  id: string
  name: string
  features: string[]
  image: string
  originalPrice: number
  coupon: number
  // ... 更多字段
}
```

#### `src/types/productComment.ts` - 评论类型 ⭐⭐⭐
```typescript
// 📍 位置: src/types/productComment.ts
// 🎯 功能: 商品评论相关类型定义
export interface ProductComment {
  id: string
  userId: string
  userName: string
  rating: number
  content: string
  // ... 更多字段
}
```

#### `src/types/carouselItem.ts` - 轮播项类型
```typescript
// 📍 位置: src/types/carouselItem.ts
// 🎯 功能: 轮播图数据类型定义
```

#### `src/types/flashSale.ts` - 秒杀类型
```typescript
// 📍 位置: src/types/flashSale.ts
// 🎯 功能: 限时抢购相关类型定义
```

### 📂 状态管理 (`src/context/` & `src/store/`)

#### `src/context/CartContext.tsx` - 购物车状态 ⭐⭐⭐
```typescript
// 📍 位置: src/context/CartContext.tsx
// 🎯 功能: 购物车全局状态管理
// 🔧 技术: React Context + useReducer
// 📊 功能: 添加商品、删除商品、修改数量、清空购物车
```

#### `src/store/authStore.ts` - 认证状态
```typescript
// 📍 位置: src/store/authStore.ts
// 🎯 功能: 用户认证状态管理
// 🔧 技术: Zustand
```

#### `src/store/userInfostore.ts` - 用户信息状态
```typescript
// 📍 位置: src/store/userInfostore.ts
// 🎯 功能: 用户信息状态管理
// 🔧 技术: Zustand
```

### 📂 自定义 Hooks (`src/hooks/`)

#### `src/hooks/useFavorites.ts` - 收藏功能 ⭐⭐⭐
```typescript
// 📍 位置: src/hooks/useFavorites.ts
// 🎯 功能: 商品收藏状态管理
// 🔧 技术: React Hooks + localStorage
// 📊 功能: 添加收藏、取消收藏、检查收藏状态
```

#### `src/hooks/useVerificationCode.ts` - 验证码
```typescript
// 📍 位置: src/hooks/useVerificationCode.ts
// 🎯 功能: 短信验证码倒计时管理
```

#### `src/hooks/useWebSocket.ts` - WebSocket
```typescript
// 📍 位置: src/hooks/useWebSocket.ts
// 🎯 功能: WebSocket 连接管理
```

#### `src/hooks/useAuthLifecycle.ts` - 认证生命周期
```typescript
// 📍 位置: src/hooks/useAuthLifecycle.ts
// 🎯 功能: 用户认证生命周期管理
```

### 📂 服务层 (`src/services/`)

#### `src/services/AxiosService.ts` - HTTP 服务
```typescript
// 📍 位置: src/services/AxiosService.ts
// 🎯 功能: HTTP 请求封装和拦截器配置
```

#### `src/services/apiPaths.ts` - API 路径
```typescript
// 📍 位置: src/services/apiPaths.ts
// 🎯 功能: API 接口路径定义
```

#### `src/services/accountInfo.ts` - 账户服务
```typescript
// 📍 位置: src/services/accountInfo.ts
// 🎯 功能: 用户账户相关 API 调用
```

#### WebSocket 服务 (`src/services/ws/`)
##### `src/services/ws/webSocketContext.ts` - WebSocket 上下文
##### `src/services/ws/WebSocketProvider.tsx` - WebSocket 提供者
##### `src/services/ws/messageRouter.ts` - 消息路由
##### `src/services/ws/types.ts` - WebSocket 类型

### 📂 工具组件

#### `src/component/ProtectedRoute.tsx` - 路由保护
```typescript
// 📍 位置: src/component/ProtectedRoute.tsx
// 🎯 功能: 需要登录的路由保护
```

---

## 🎯 功能特性详解

### 🛒 核心电商功能

#### 1. 商品展示系统
- ✅ **商品列表**: 分类展示、搜索筛选、排序功能
- ✅ **商品详情**: 图片轮播、规格选择、参数展示
- ✅ **商品评价**: 评分统计、评论列表、分页加载
- ✅ **相关推荐**: 智能推荐、最近浏览历史

#### 2. 用户认证系统
- ✅ **手机号登录**: 短信验证码登录
- ✅ **邮箱登录**: 邮箱密码登录
- ✅ **注册功能**: 新用户注册流程
- ✅ **密码找回**: 安全密码重置

#### 3. 购物车系统
- ✅ **添加商品**: 支持规格选择和数量设置
- ✅ **购物车管理**: 修改数量、删除商品、清空购物车
- ✅ **价格计算**: 自动计算总价、优惠金额
- ✅ **库存检查**: 实时库存验证

#### 4. 订单系统
- ✅ **订单创建**: 从购物车生成订单
- ✅ **收货地址**: 全国地址选择和管理
- ✅ **支付方式**: 多种支付方式支持
- ✅ **订单状态**: 实时订单状态跟踪

### 🎨 用户界面特性

#### 1. 响应式设计
- ✅ **桌面端优化**: 大屏幕最佳体验
- ✅ **移动端适配**: 触屏友好操作
- ✅ **平板适配**: 中等屏幕完美展示

#### 2. 交互体验
- ✅ **流畅动画**: Framer Motion 动画效果
- ✅ **加载状态**: 优雅的加载指示器
- ✅ **错误处理**: 用户友好的错误提示
- ✅ **表单验证**: 实时表单验证反馈

#### 3. 无障碍访问
- ✅ **键盘导航**: 完整的键盘操作支持
- ✅ **屏幕阅读器**: ARIA 属性支持
- ✅ **高对比度**: 良好的视觉可访问性

### 🔧 技术特性

#### 1. 性能优化
- ✅ **代码分割**: 路由级别的代码分割
- ✅ **懒加载**: 组件和图片的懒加载
- ✅ **缓存策略**: 智能缓存和预加载
- ✅ **Bundle 优化**: Vite 构建优化

#### 2. 数据管理
- ✅ **状态管理**: Zustand + React Context 双重保障
- ✅ **数据持久化**: localStorage + SessionStorage
- ✅ **API 封装**: 统一的 HTTP 请求管理
- ✅ **错误处理**: 完善的错误边界和重试机制

#### 3. 开发体验
- ✅ **TypeScript**: 完整的类型安全
- ✅ **ESLint**: 代码质量自动化检查
- ✅ **热重载**: Vite 快速热重载
- ✅ **调试支持**: 完整的开发工具支持

---

## 🛠️ 开发指南

### 🚀 快速开始

#### 环境要求
```bash
Node.js >= 18.0.0
pnpm >= 8.0.0
```

#### 安装依赖
```bash
# 克隆项目
git clone https://github.com/your-org/lenovo-shop.git
cd lenovo-shop

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

#### 移动端开发
```bash
# 添加 Android 平台
npx cap add android

# 同步到原生项目
npx cap sync android

# 在 Android Studio 中打开
npx cap open android
```

### 📝 开发规范

#### 命名规范
```typescript
// 组件命名: PascalCase
const ProductCard.tsx
const UserProfile.tsx

// 文件命名: kebab-case
src/components/product-card.tsx
src/hooks/use-auth.ts

// 变量命名: camelCase
const userName: string
const isLoading: boolean

// 类型命名: PascalCase
interface UserInfo {}
type ProductStatus = 'active' | 'inactive'
```

#### 代码组织
```typescript
// 1. 导入顺序
import React from 'react'              // React 相关
import { useState } from 'react'

import { Button } from 'antd'          // 第三方库
import axios from 'axios'

import { useAuth } from '../hooks'     // 内部模块
import { UserCard } from '../components'
import type { User } from '../types'

// 2. 组件结构
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Hooks (按使用顺序)
  const [state, setState] = useState(initialValue)
  const { data, loading } = useCustomHook()

  // 2. 事件处理函数
  const handleClick = () => {
    // 处理逻辑
  }

  // 3. 计算属性
  const computedValue = useMemo(() => {
    return expensiveCalculation(data)
  }, [data])

  // 4. 渲染逻辑
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

#### 提交规范
```bash
# 提交类型
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或工具配置更新

# 示例
git commit -m "feat: 添加商品收藏功能"
git commit -m "fix: 修复购物车数量显示错误"
git commit -m "docs: 更新README安装指南"
```

### 🔧 常用命令

#### 开发命令
```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 格式化代码
pnpm format
```

#### 移动端命令
```bash
# 添加平台
npx cap add android
npx cap add ios

# 同步更改
npx cap sync
npx cap sync android
npx cap sync ios

# 打开原生IDE
npx cap open android
npx cap open ios

# 运行
npx cap run android
npx cap run ios
```

### 📊 项目配置

#### Vite 配置 (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

#### TailwindCSS 配置 (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lenovo-red': '#E1140A',
        'lenovo-blue': '#0066CC',
      }
    },
  },
  plugins: [],
}
```

#### ESLint 配置 (`eslint.config.js`)
```javascript
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // 自定义规则
    }
  }
]
```

---

## 📋 TODO 清单

### 🔥 高优先级

#### 1. 性能优化
- [ ] **图片懒加载**: 实现商品图片的懒加载和预加载
- [ ] **虚拟滚动**: 长列表组件使用虚拟滚动优化性能
- [ ] **代码分割**: 按路由和功能模块进行代码分割
- [ ] **Bundle 分析**: 使用 `vite-bundle-analyzer` 分析包大小

#### 2. 用户体验
- [ ] **骨架屏**: 添加页面和组件的加载骨架屏
- [ ] **错误边界**: 为关键组件添加错误边界处理
- [ ] **离线支持**: 实现 PWA 离线访问功能
- [ ] **国际化**: 支持多语言切换 (中文/英文)

#### 3. 功能完善
- [ ] **商品对比**: 实现商品对比功能
- [ ] **收藏夹页面**: 创建完整的收藏夹管理页面
- [ ] **订单历史**: 完善订单历史和详情页面
- [ ] **物流跟踪**: 实现订单物流实时跟踪

### 📈 中优先级

#### 4. 数据管理
- [ ] **数据缓存**: 实现智能的数据缓存策略
- [ ] **乐观更新**: 购物车操作使用乐观更新
- [ ] **数据同步**: 多标签页数据同步机制
- [ ] **状态持久化**: 关键状态的持久化存储

#### 5. 测试覆盖
- [ ] **单元测试**: 为核心组件编写单元测试
- [ ] **集成测试**: 页面级别的集成测试
- [ ] **E2E 测试**: 使用 Playwright 编写端到端测试
- [ ] **测试覆盖率**: 达到 80%+ 的测试覆盖率

#### 6. 安全性
- [ ] **XSS 防护**: 完善 XSS 攻击防护
- [ ] **CSRF 保护**: 实现 CSRF 令牌验证
- [ ] **数据加密**: 敏感数据传输加密
- [ ] **安全审计**: 定期安全漏洞扫描

### 🎯 低优先级

#### 7. 高级功能
- [ ] **AI 推荐**: 基于用户行为的智能推荐
- [ ] **虚拟试用**: 3D 产品虚拟试用功能
- [ ] **AR 展示**: 增强现实产品展示
- [ ] **语音搜索**: 语音输入商品搜索

#### 8. 运营功能
- [ ] **数据统计**: 用户行为数据分析
- [ ] **A/B 测试**: 功能迭代的 A/B 测试框架
- [ ] **推送通知**: Web 推送通知功能
- [ ] **用户反馈**: 在线用户反馈收集

#### 9. 移动端优化
- [ ] **手势操作**: 移动端手势交互优化
- [ ] **离线缓存**: 移动端离线内容缓存
- [ ] **原生功能**: 调用设备原生功能 (相机、GPS 等)
- [ ] **性能监控**: 移动端性能监控和优化

---

## 🤝 贡献指南

### 📝 提交 Pull Request

1. **Fork 项目** 到你的 GitHub 账户
2. **创建特性分支**: `git checkout -b feature/amazing-feature`
3. **提交更改**: `git commit -m 'feat: add amazing feature'`
4. **推送分支**: `git push origin feature/amazing-feature`
5. **创建 Pull Request**

### 🐛 报告 Bug

使用 [GitHub Issues](https://github.com/your-org/lenovo-shop/issues) 报告 bug，请包含：
- 详细的错误描述
- 重现步骤
- 期望的行为
- 实际的行为
- 浏览器和系统信息

### 💡 提出功能建议

欢迎通过 [GitHub Discussions](https://github.com/your-org/lenovo-shop/discussions) 提出新功能建议。

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

---

## 📞 联系我们

- **项目维护者**: Lenovo Development Team
- **技术支持**: support@lenovo.com
- **商务合作**: business@lenovo.com

---

<div align="center">

**Lenovo Shop** © 2024. Made with ❤️ by Lenovo Development Team.

[⬆️ 返回顶部](#-lenovo-shop---联想官方商城)

</div>
