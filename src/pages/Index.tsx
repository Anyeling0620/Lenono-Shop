/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-18 20:09:36
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-22 12:12:37
 * @FilePath: \lenovo-shop\src\pages\Index.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import React from 'react';
import Roll from './Roll';
import QuickAccess from './QuickAccess';
import Recommended from './Recommended';

const Index: React.FC = () => {
  return (
    <div className="flex justify-center mt-2 w-full">
      <div className="relative m-auto">
        <Roll />
        <QuickAccess />
        <Recommended />
      </div>
    </div>
  );
};

export default Index;
