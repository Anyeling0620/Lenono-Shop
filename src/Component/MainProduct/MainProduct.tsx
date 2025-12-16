// src/component/MainProduct/MainProduct.tsx

// 1. 引入我们新建的数据文件 (新增这行)
import { useEffect, useState } from "react";
import { getIndexProductList } from "../../services/products";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";

// 2. 引入组件 (保持不变)
import Category from "./MainProductCategory";
import type { ProductsResponse } from "../../types/product";
import toast from "react-hot-toast";


const MainProduct = () => {
  const [indexProductGroups, setIndexProductGroups] = useState<ProductsResponse[]>(
          [{
              title: '',
              productList: []
          }]
      )
  
      useEffect(() => {
          const fetchData = async () => {
              try {
                  const data = await getIndexProductList()
                  setIndexProductGroups(data)
              } catch (error) {
                  globalErrorHandler.handle(error, toast.error)
              }
          }
          fetchData()
      }, [])

  return (
    <div className="relative w-[1200px] mx-auto my-0">
      {indexProductGroups.map((group) => (
        <Category
          key={group.title}
          group={group}
        />
      ))}
    </div>
  );
};

export default MainProduct;
