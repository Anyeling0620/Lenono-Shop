<!--
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-22 09:29:12
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-26 00:15:06
 * @FilePath: \lenovo-shop\README.md
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->

## 一个基于 react19 + vite + typeSricpt 的项目

### 项目名称 lenovo-shop

### 项目初始化

```
pnpm install
```

### 开发环境编译和热重载项目

```
pnpm dev
```

## 开发说明

### 1. 项目目录结构

```
lenovo-shop                 // 项目根目录
├─ 📁public                   // 公共资源目录:存放图片等静态资源
│  └─ 📁images             // 存放图片资源
│     └─ 📁roll
│        ├─ 📄1.jpg
│        ├─ 📄1.png
│        ├─ 📄2.png
│        ├─ 📄3.png
│        ├─ 📄4.png
│        └─ 📄5.png
├─ 📁src                   // 源码目录
│  ├─ 📁assets             // 静态资源目录:存放字体、图标等静态资源
│  │  ├─ 📄agreementContent.tsx
│  │  └─ 📄icon.ts              // 建议将svg转成base64格式，放入此文件夹
│  ├─ 📁component            // 组件目录， 原本应该是存放公共组件的，这里将组件都放到这里即可。请尽量细化组件，尽量一个功能一个组件，不要把一大堆代码写成一个组件，会成屎
│  │  ├─ 📁Auth            // 登录注册组件，这里存放登录注册相关的组件
│  │  │  ├─ 📄AgreementCheckbox.tsx       // 协议复选框组件
│  │  │  ├─ 📄AgreementModal .tsx          // 协议弹窗组件
│  │  │  ├─ 📄AuthForm.tsx                 // 登录注册表单组件
│  │  │  ├─ 📄FormField.tsx               // 表单字段组件
│  │  │  ├─ 📄LoginModeTabs.tsx           // 登录方式切换组件
│  │  │  ├─ 📄SubmitButton.tsx           // 提交按钮组件
│  │  │  └─ 📄VerificationCodeField.tsx    // 验证码输入框组件
│  │  ├─ 📁Carousel            // 轮播图组件
│  │  │  ├─ 📄Carousel.tsx              // 轮播图主组件
│  │  │  ├─ 📄CarouselItem.tsx          // 轮播图子项组件
│  │  │  ├─ 📄CarouselTrack.tsx        // 轮播图轨道组件
│  │  │  ├─ 📄Indicators.tsx           // 轮播图指示器组件
│  │  │  └─ 📄NavigationButtons.tsx      // 轮播图导航按钮组件
│  │  ├─ 📁Footer            // 页脚组件
│  │  │  ├─ 📄Footer.tsx              // 页脚主组件
│  │  │  ├─ 📄FooterBanner.tsx         // 页脚横幅组件
│  │  │  ├─ 📄FooterContact.tsx        // 页脚联系方式组件
│  │  │  ├─ 📄FooterLinkColumn.tsx     // 页脚链接列组件
│  │  │  └─ 📄FooterLinksSection.tsx   // 页脚链接部分组件
│  │  ├─ 📁Header          // 页头组件
│  │  │  ├─ 📄AuthLinks.tsx          // 页头登录注册链接组件
│  │  │  ├─ 📄Header.tsx              // 页头主组件
│  │  │  ├─ 📄Logo.tsx                // 页头logo组件
│  │  │  ├─ 📄Navbar.tsx              // 页头导航栏组件
│  │  │  └─ 📄SearchBar.tsx           // 页头搜索栏组件
│  │  ├─ 📁Layout            // 布局组件
│  │  │  └─ 📄MainLayout.tsx          // 主布局组件
│  │  ├─ 📁QuickAccess        // 快捷入口组件
│  │  │  ├─ 📄QuickAccess.tsx         // 快捷入口主组件
│  │  │  └─ 📄QuickItem.tsx           // 快捷入口子项组件
│  │  ├─ 📁RightNavBar        // 右侧导航栏组件
│  │  │  ├─ 📄NavItem.tsx          // 导航项组件
│  │  │  ├─ 📄RightNavBar.tsx       // 右侧导航栏主组件
│  │  │  ├─ 📄ScrollToTop.tsx       // 返回顶部组件
│  │  │  └─ 📄UserNavItem.tsx       // 用户中心导航项组件
│  │  └─ 📄Roll.tsx            // 轮播图组件 --- 应该没有用了
│  ├─ 📁hooks              // 自定义hook目录  -- 让ai写代码时尽量不要把ai写的又臭又长还没实际功能的hook封装出来，一点用没有还难复用
│  │  └─ 📄useVerificationCode.ts  // 验证码hook
│  ├─ 📁pages                // 页面目录 ---------组件跟目录区分开，页面由多个组件组合而成
│  │  ├─ 📁Auth            // 登录注册页面
│  │  │  ├─ 📄AuthBackground.tsx   // 登录注册背景组件
│  │  │  ├─ 📄Login.tsx             // 登录页面
│  │  │  └─ 📄Register.tsx          // 注册页面
│  │  ├─ 📄404.tsx            // 404页面
│  │  ├─ 📄FlashSale.tsx        // 限时抢购组件
│  │  ├─ 📄index.tsx          // 首页
│  │  ├─ 📄NewProduct.tsx       // 新品推荐组件
│  │  └─ 📄Recommended.tsx     // 推荐商品组件
│  ├─ 📁types                // 类型定义目录  -- 后期调用后端接口时为获取数据所定义的类型放这里 ， 组件里的获取参数的类型定义放组件里就行
│  │  ├─ 📄carouselItem.ts      // 轮播图子项类型
│  │  ├─ 📄formState.ts        // 表单状态类型
│  │  ├─ 📄hiddenPaths.ts      // 隐藏路径类型
│  │  ├─ 📄navItem.ts          // 导航项类型
│  │  └─ 📄quickAccessItems.ts  // 快捷入口类型
│  ├─ 📁utils   // 工具函数目录
│  │  └─ 📄imageConfig.ts   // 图片路径配置工具函数
│  ├─ 📄App.tsx           // 根组件
│  ├─ 📄index.css          // 全局样式文件
│  └─ 📄main.tsx          // 入口文件
├─ 📄.env.development  // 开发环境环境变量文件
├─ 📄.gitignore  // git忽略文件
├─ 📄eslint.config.js  // eslint配置文件            --- 请勿修改配置文件 ---
├─ 📄index.html  // 入口html文件
├─ 📄LICENSE
├─ 📄package-lock.json  // 依赖锁文件
├─ 📄package.json    // 依赖文件
├─ 📄pnpm-lock.yaml  // 依赖锁文件
├─ 📄postcss.config.js  // postcss配置文件
├─ 📄README.md  // 项目说明文件
├─ 📄tailwind.config.js  // tailwindcss配置文件
├─ 📄tsconfig.app.json  // ts配置文件
├─ 📄tsconfig.json  // ts配置文件
├─ 📄tsconfig.node.json  // ts配置文件
└─ 📄vite.config.ts // vite配置文件
```

### 2. 项目开发规范

#### 2.1 代码规范

- 使用 ESLint 进行代码规范检查，确保代码风格一致: 把鼠标停在错误代码处，ESLint 会给你错误提示
- 使用 Prettier 进行代码格式化，确保代码格式美观。( shift + alt + f )
- 使用 TypeScript 进行类型检查，确保代码类型安全:

#### 2.2 组件规范

- 组件命名应遵循 PascalCase 命名规范。
- 组件应尽量细化，一个功能一个组件，避免将一大堆代码写成一个组件。
- 组件应尽量复用，避免重复代码。

#### 2.3 页面规范

- 页面应尽量由多个组件组合而成，避免将一大堆代码写成一个页面。

#### 2.4 命名规范

- src 目录下文件夹命名使用小写字母。
- 组件命名应遵循 PascalCase 命名规范。
- 以 index 命名的文件应为 index 而非 Index。
- 文件名应尽量简洁明了，避免使用缩写。

#### 2.5 路由规范

- 路由命名应遵循小写字母加连字符的命名规范。
- 路由命名应尽量简洁明了，避免使用缩写。

#### 2.6 环境变量规范

- 环境变量以 VITE 开头，全大写字母，单词之间以\_分隔,用=赋值，不能有空格，如 VITE_API_URL=https://api.example.com
- 环境变量文件以.env 开头，如.env.development,这是开发环境的环境变量文件，.env.production 是生产环境的环境变量文件
- 环境变量文件中不能有注释

### 项目日志

### v1.0.0 2025-11-24

实现功能： 见项目目录

### v1.1.0 2025-11-26

#### 更新：

1. 新增商品秒杀相关接口声明
2. 新增时间相关工具函数
3. 重构商品秒杀组件
4. 修复了一些 bug

```
📁FlashSale
├─ 📄FlashSale.tsx
├─ 📄ProductCard.tsx
├─ 📄SessionTab.tsx
└─ 📄TimeDisplay.tsx

📁types
└─ 📄flashSale.ts

📁utils
└─ 📄timeCalculator.ts
```
