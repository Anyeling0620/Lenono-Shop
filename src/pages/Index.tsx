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
