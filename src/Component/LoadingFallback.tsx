import { Spin } from "antd";

// 加载中组件
export const LoadingFallback = () => (
  <div className="grid place-items-center h-[50vh] text-[#818181]" >
     <Spin size="large" styles={{indicator:{color:"#818181", paddingTop:"40vh"}}} >
     </Spin>
     loading...
  </div>
)

export const Loading = () => (
  <div className="grid place-items-center h-[40vh] text-[#818181]" >
     <Spin size="large" styles={{indicator:{color:"#818181", paddingTop:"30vh"}}} >
     </Spin>
     loading...
  </div>
)