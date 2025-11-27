/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-20 20:39:48
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-28 00:39:00
 * @FilePath: \lenovo-shop\src\component\Header\SearchBar.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import React, { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";

/**
 * 搜索栏组件
 * 用于用户输入关键词并进行搜索功能
 */
const SearchBar: React.FC = () => {
  // 使用useState管理搜索关键词状态
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [warnInput, setWarnInput] = useState(false)
  // 使用useNavigate获取导航函数，用于页面跳转
  const navigate = useNavigate();

  // 处理搜索按钮点击事件

  const isWarnInput = useCallback(() => {
    if (warnInput) return;
    setWarnInput(true);
    setTimeout(() => {
      setWarnInput(false);
    }, 800);
  }, [warnInput])

  const handleSearch = useCallback(() => {
    // 检查关键词是否为空或只包含空格
    if (!keyword.trim()) {
      inputRef.current?.focus();
      isWarnInput();
      return;
    }
    // 导航到搜索结果页面，并将关键词进行URL编码
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`)
  }, [keyword, navigate, isWarnInput]);

  const debounceSearch = useDebouncedCallback(handleSearch, 300);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") debounceSearch();
  };

  const handleClear = () => {
    setKeyword("");
    inputRef.current?.focus();
  }

  return (
    <div className="mt-[13px] float-right w-[280px] h-[36px] relative mr-8">
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[#f4f4f4] z-0 rounded-sm"></div>
        <button
          onClick={debounceSearch}
          className="absolute left-[10px] top-[50%] -translate-y-1/2 z-10 w-[30px] h-[30px] flex items-center justify-center"
        >
          <img
            src="https://p4.lefile.cn/product/adminweb/2018/12/29/f26ff743-3f82-4072-b27a-193f0e9ad675.png"
            alt="搜索商品"
            className="w-[20px] h-[20px]"
          />
        </button>

        <input
          type="text"
          ref={inputRef}
          value={keyword}
          onKeyDown={handleKeyDown}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索商品"
          className={`absolute left-0 top-0 z-5 w-full h-full pl-[50px] bg-transparent outline-none border-none text-[13px] text-[#999] ${warnInput
            ? 'animate-border-blink border-red-500 border-[1px] shadow-[0_0_0_1px_rgb(239,68,68)]'
            : ''
            }`} />
        {keyword && (
          <button
            onClick={handleClear}
            className="absolute right-[10px] top-[50%] -translate-y-1/2 z-10 w-[20px] h-[20px] flex items-center justify-center text-gray-400 hover:text-gray-600 text-lg font-light"
            title="清空搜索"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};


export default SearchBar;