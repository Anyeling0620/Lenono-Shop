/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-26 21:07:25
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-26 22:12:49
 * @FilePath: \lenovo-shop\src\pages\Search.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { useSearchParams } from 'react-router-dom'

const Search = () => {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('q')

  return (
    <div className='bg-[#efefef]'>
      
      {keyword}

    </div>
  )
}

export default Search