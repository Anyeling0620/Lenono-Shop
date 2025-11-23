<!--
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-22 09:29:12
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-23 17:54:21
 * @FilePath: \lenovo-shop\README.md
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
## React19 + vite + typeSricpt

# lenovo-shop


# v0.1.0

## 2025-11-21
```
lenovo-shop
├─ 📁public
├─ 📁src
│  ├─ 📁assets                          // 静态资源
│  │  ├─ 📄agreementContent.tsx         // 协议内容
│  │  └─ 📄icon.ts                      // 图标
│  ├─ 📁Component
│  │  ├─ 📁Auth
│  │  │  ├─ 📄AgreementCheckbox.tsx     // 协议复选框
│  │  │  ├─ 📄AgreementModal .tsx       // 协议模态框
│  │  │  ├─ 📄AuthForm.tsx              // 登录注册表单
│  │  │  ├─ 📄FormField.tsx             // 表单字段
│  │  │  ├─ 📄LoginModeTabs.tsx         // 登录方式切换
│  │  │  ├─ 📄SubmitButton.tsx          // 提交按钮
│  │  │  └─ 📄VerificationCodeField.tsx // 验证码字段
│  │  ├─ 📁Footer
│  │  │  ├─ 📄Footer.tsx                // 页脚
│  │  │  ├─ 📄FooterBanner.tsx          // 页脚横幅
│  │  │  ├─ 📄FooterContact.tsx         // 页脚联系
│  │  │  ├─ 📄FooterLinkColumn.tsx      // 页脚链接列
│  │  │  └─ 📄FooterLinksSection.tsx    // 页脚链接部分
│  │  ├─ 📁Header
│  │  │  ├─ 📄AuthLinks.tsx             // 认证链接
│  │  │  ├─ 📄Header.tsx                // 页头
│  │  │  ├─ 📄Logo.tsx                  // logo
│  │  │  ├─ 📄Navbar.tsx                // 导航栏
│  │  │  └─ 📄SearchBar.tsx             // 搜索栏
│  │  └─ 📁RightNavBar
│  │     ├─ 📄NavItem.tsx               // 导航项
│  │     ├─ 📄RightNavBar.tsx           // 右侧导航栏
│  │     ├─ 📄ScrollToTop.tsx           // 滚动到顶部
│  │     └─ 📄SpecialNavItem.tsx        // 特殊导航项
│  ├─ 📁Hooks
│  │  └─ 📄useVerificationCode.ts       // 验证码hook
│  ├─ 📁pages
│  │  ├─ 📁Auth
│  │  │  ├─ 📄Login.tsx                 // 登录页面
│  │  │  └─ 📄Register.tsx              // 注册页面
│  │  └─ 📄Index.tsx
│  ├─ 📁Types
│  │  ├─ 📄formState.ts                 // 表单状态类型
│  │  ├─ 📄hiddenPaths.ts               // 隐藏路径类型
│  │  └─ 📄navItem.ts                   // 导航项类型
│  ├─ 📄App.tsx                         // 应用入口
│  ├─ 📄index.css                       // 全局样式
│  └─ 📄main.tsx                        // 主入口
├─ 📄.gitignore                         // git忽略文件
├─ 📄eslint.config.js                   // eslint配置
├─ 📄index.html                         // 入口html
├─ 📄package-lock.json                  // npm锁文件
├─ 📄package.json                       // 依赖包
├─ 📄pnpm-lock.yaml                     // pnpm锁文件
├─ 📄postcss.config.js                  // postcss配置
├─ 📄README.md                          // 项目说明
├─ 📄tailwind.config.js                 // tailwind配置
├─ 📄tsconfig.app.json                  // ts配置
├─ 📄tsconfig.json                      // ts配置
├─ 📄tsconfig.node.json                 // ts配置
└─ 📄vite.config.ts                     // vite配置
```


# v0.1.1
## 2025-11-22
```
lenovo-shop
├─ 📁src   
│  ├─ 📁Component
│  │  ├─ 📁Layout
│  │  │  └─ 📄MainLayout.tsx            //新增路由分组组件
│  │  └─ 📁RightNavBar
│  │     └─ 📄NavItem.tsx               // 修复bug    
│  ├─ 📁pages
│  │  ├─ 📁Auth
│  │  │  ├─ 📄AuthBackground.tsx        // 重构认证页面背景组件
│  │  │  ├─ 📄Login.tsx
│  │  │  └─ 📄Register.tsx
│  │  ├─ 📄404.tsx                      // 新增404页面
│  │  └─ 📄Index.tsx
│  ├─ 📄App.tsx                         // 调整路由
```

# v0.1.2

## 2025-11-22

```
lenovo-shop
├─ 📁public                             // 静态资源 
│  └─ 📁images
│     └─ 📁roll
│        ├─ 📄1.png
│        ├─ 📄2.png
│        ├─ 📄3.png
│        ├─ 📄4.png
│        └─ 📄5.png
├─ 📁src
│  ├─ 📁Component
│  │  ├─ 📁Layout
│  │  │  └─ 📄MainLayout.tsx
│  │  └─ 📁RightNavBar                  // 逻辑调整
│  │     ├─ 📄NavItem.tsx
│  │     ├─ 📄RightNavBar.tsx       
│  │     ├─ 📄ScrollToTop.tsx
│  │     └─ 📄SpecialNavItem.tsx
│  ├─ 📁pages
│  │  ├─ 📄FlashSale.tsx
│  │  ├─ 📄Index.tsx
│  │  ├─ 📄QuickAccess.tsx
│  │  ├─ 📄Recommended.tsx        
│  │  └─ 📄Roll.tsx                     // 轮播图
│  ├─ 📁utils                           // 新增工具文件夹
│     └─ 📄imageConfig.ts               // 新增图片工具
├─ 📄.env.development                   // 新增开发环境配置

```

v0.1.5

## 2025-11-23


```
lenovo-shop
├─ 📁public
├─ 📁src
│  ├─ 📁Component
│  │  ├─ 📁Carousel                      // 新增轮播图组件
│  │  │  ├─ 📄Carousel.tsx
│  │  │  ├─ 📄CarouselItem.tsx
│  │  │  ├─ 📄CarouselTrack.tsx
│  │  │  ├─ 📄Indicators.tsx
│  │  │  └─ 📄NavigationButtons.tsx
│  │  ├─ 📁QuickAccess                // 快速通道组件
│  │  │  ├─ 📄QuickAccess.tsx
│  │  │  └─ 📄QuickItem.tsx
│  │  └─ 📄Roll.tsx
│  ├─ 📁pages
│  │  ├─ 📄404.tsx
│  │  ├─ 📄FlashSale.tsx            // 待重构       
│  │  ├─ 📄Index.tsx
│  │  ├─ 📄NewProduct.tsx
│  │  └─ 📄Recommended.tsx
│  ├─ 📁types
│  │  ├─ 📄carouselItem.ts
│  │  └─ 📄quickAccessItems.ts
│  ├─ 📄App.tsx
│  ├─ 📄index.css
│  └─ 📄main.tsx
├─ 📄.env.development           // 开发环境配置文件
├─ 📄.gitignore                 // 请勿随意修改配置文件，可能会导致各种错误    
├─ 📄eslint.config.js
├─ 📄index.html
├─ 📄LICENSE
├─ 📄package-lock.json
├─ 📄package.json
├─ 📄pnpm-lock.yaml
├─ 📄postcss.config.js
├─ 📄README.md
├─ 📄tailwind.config.js
├─ 📄tsconfig.app.json
├─ 📄tsconfig.json
├─ 📄tsconfig.node.json
└─ 📄vite.config.ts
```