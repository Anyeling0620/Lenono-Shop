// src/component/MainProduct/MainProduct.tsx

import { use } from "react";
import MainProductCategory from "./MainProductCategory";
import { IndexProductContext } from "../../pages/Index";


const MainProduct = () => {
  const indexProductGroups = use(IndexProductContext).items

  if (!indexProductGroups) return <></>
  return (
    <div className="relative w-[1200px] mx-auto my-0">
      {indexProductGroups.map((group) => (
        <MainProductCategory
          key={group.title}
          group={group}
        />
      ))}
    </div>
  );
};

export default MainProduct;
