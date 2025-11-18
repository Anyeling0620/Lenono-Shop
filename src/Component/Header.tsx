import React from 'react'

const Header = () => {
    return (
        <>
            <header className='bg-white top-0 left-0 min-w-[1200px]'>
                <div className='w-[1200px] m-auto h-[60px]'>
                    <div className='float-left mt-1 w-[155px] h-[60px] relative'>
                        <div className='inline'>
                            <a href="#" className='inline-block no-underline' target='_parent'>
                                <img src="https://p4.lefile.cn/fes/cms/2021/09/24/skz7mq0zavm0hd8xfaq0nrofxcwje3959207.png" alt="联想商城"
                                    className='w-[178px] mt-[12px] border-0 align-top' />
                            </a>
                        </div>
                    </div>

                    <ul className='float-left h-[60px] ml-[62px] m-0 list-none'>
                        {[...Array(9)].map((_, index) => (
                            <li key={index} className='float-left mr-[26px] h-[60px] border-b-4 leading-[60px] transition-all duration-200'>
                                <a href="#" className='text-[16px] text-[#252525] font-normal relative no-underline'>新品</a>
                            </li>
                        ))}
                    </ul>

                    <div className='float-right relative'>
                        <div className='leading-[60px] float-left relative text-[12.5px] flex items-center'>
                            <a href="#" className='text-[#b5b5b5]'>注册</a>
                            <i className='border-l h-[11px] inline-block my-[-1px] mx-2'></i>
                            <a href="#" className='text-[#b5b5b5]'>登陆</a>
                        </div>
                    </div>


                    <div className='mt-[13px] float-right w-[280px] h-[36px] relative mr-8'>
                        <div className='w-[280px] h-[36px]'>
                            <div className='w-[280px] h-[36px] bg-[#f4f4f4] absolute top-0 z-0 left-0'></div>
                            <a className='block text-center text-[16px] absolute left-[10px] top-[1px] w-[30px] h-[30px] leading-[20px] z-[2] cursor-pointer'>
                                <img src="https://p4.lefile.cn/product/adminweb/2018/12/29/f26ff743-3f82-4072-b27a-193f0e9ad675.png" alt="搜索" className='mt-[8px] no-underline float-left ml-1 box-border h-[20px]' />
                            </a>
                            <input type="text" className='w-[220px] h-[36px] outline-0 text-[13px] absolute left-0 top-0 z-[1] bg-transparent border-none text-[#999] pl-[50px] box-content' />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
