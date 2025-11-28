// src/component/MainProduct/MainProduct.tsx

// 1. 引入我们新建的数据文件 (新增这行)
import { productCategories } from "../../assets/data/mockProducts"; 

// 2. 引入组件 (保持不变)
import Category from "./MainProductCategory";

// 3. 删除原本在这里定义的 const productCategories = [...] 这一大段代码
// (确保删干净，不要留重复的变量名)

const MainProduct = () => {
  return (
    <div className="relative w-[1200px] mx-auto my-0">
      {productCategories.map((category) => (
        <Category
          key={category.category}
          name={category.category}
          image={category.image}
          // 这里需要注意：如果 TS 报错类型不匹配，可以使用 products={category.products as any} 临时规避
          // 因为我们的详细数据 DetailedProduct 包含了 MainProduct 的所有字段，所以是兼容的
          products={category.products}
        />
      ))}
    </div>
  );
};

export default MainProduct;