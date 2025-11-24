import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NotFound = () => {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
  const interval = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        clearInterval(interval);
       
          navigate("/"); 
       
        return prev; 
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [navigate]);


  return (
    <div className="h-full w-full flex flex-col items-center justify-center  text-center px-4">
      <img
        className="mx-auto w-[800px] mt-[2%]"
        src="https://p1.lefile.cn/product/adminweb/2018/03/31/80faf944-e4bd-458e-8716-4545d18eb9e2.png"
        alt="404"
      />

      <div className="mt-7 flex  w-full">
        <div className="flex items-end gap-2 ml-[25%] ">
          <div className="h-[60px] overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={timer}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-red-600 font-bold text-6xl leading-[60px] mt-1"
              >
                {timer}
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="text-red-600 text-5xl">秒</span>
          <span className="text-gray-700 text-3xl">后返回</span>
          <span className="text-gray-600 text-3xl">首页</span>
        </div>
        <Link to="/" className="ml-auto mr-[25%]">
          <img
            className="w-[200px] "
            src="https://p2.lefile.cn/product/adminweb/2018/03/31/da3e9eab-618e-41bc-89cc-e632eb464951.jpg"
            alt="返回首页"
          />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
