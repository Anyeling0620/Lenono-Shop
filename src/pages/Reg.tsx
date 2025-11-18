import React from 'react'
import { errIcon, agreeIcon, agreeOkIcon } from './Login'
const Reg = () => {

    return (
        <div className='text-[12px] m-0 p-0'>
            <div className='h-[100%] w-[100%] block '>
                <div className='bg-[url(https://p1.lefile.cn/lenovo_auth/login_adbg.jpg)] bg-no-repeat bg-center bg-[length:1920px_800px] h-[800px] relative w-[100%]'>
                    <div className='box-border h-[100%] mx-auto pt-16 w-[1200px]'>
                        <div className='bg-white/95 rounded float-right h-auto mb-[80px] min-h-[586px] relative right-[30px] w-[460px]'>
                            <div className=' overflow-hidden block'>
                                <div className='text-[#252525] text-[30px] font-bold tracking-normal m-[58px_54px_35px_50px]'>注册联想账号</div>
                                <div className='box-border px-[45px] py-0 w-[100%]'>
                                    <div className='block'>
                                        <div className='h-[56px] mt-[28px] relative w-[100%]'>
                                            <div className='inline-block text-[14px] h-[100%] relative w-[100%]'>
                                                <input type="email" placeholder='请输入邮箱号' className=' rounded bg-[#f6f6f6] border border-[#eee] h-full indent-[18px] w-full transition-all duration-300 ease-[cubic-bezier(.645,.045,.355,1)] outline-none' />
                                            </div>
                                            <div className=' flex items-center text-[#e1140a] text-[12px] font-normal mt-[4px] absolute'>
                                                <img src={errIcon} alt="email" className="inline-block h-[11px] ml-1 mr-[3px] w-[11px]" />邮箱不能为空
                                            </div>
                                        </div>

                                        <div className='h-[56px] mt-[28px] relative w-[100%] flex'>
                                            <div className=' items-center flex w-[100%]'>
                                                <div className='inline-block text-[14px] h-[100%] relative w-[100%]'>
                                                    <input
                                                        type="number"
                                                        placeholder='请输入验证码'
                                                        className='h-[56px] bg-[#f6f6f6] rounded border border-[#eee] indent-[18px] w-full transition-all duration-300 ease-[cubic-bezier(.645,.045,.355,1)] outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                    />
                                                </div>
                                                <div className='bg-[#fff1f1] border border-[#fadfdf] rounded-[4px] text-[#e1140a] cursor-pointer text-[14px] font-normal h-[56px] tracking-[0] ml-[5px] opacity-70 text-center whitespace-nowrap w-[122px] flex items-center justify-center px-[22px]'>获取验证码</div>
                                            </div>

                                            <div className=' bottom-[-20px] items-center text-[#e1140a] text-[12px] font-normal mt-[4px] absolute'>
                                                <img src={errIcon} alt="email" className="inline-block h-[11px] ml-1 mr-[3px] w-[11px]" />
                                                邮箱不能为空
                                            </div>
                                        </div>
                                        <div className='mt-[70px] w-full flex'>
                                            <div className=' items-start'>
                                                <div className='flex'>
                                                    <img src={agreeIcon} alt="" className='hidden cursor-pointer h-[16px] mr-1 w-4' />
                                                    <img className='  cursor-pointer h-[16px] mr-1 w-4' src={agreeOkIcon} alt="" />


                                                    <p className='leading-[16px] text-[#252525] text-[12px] font-normal tracking-[0] m-0 p-0'>
                                                        已阅读并同意
                                                        <span className='text-[#252525] cursor-pointer font-bold px-[5px]'>
                                                            <a className='inline-block' href='https://www.lenovo.com.cn/statement/register_protocol.html'>注册协议、</a>
                                                            <a className='inline-block' href='https://www.lenovo.com.cn/statement/privacy.html'>隐私政策、</a>
                                                            <a className='inline-block' href='https://shop.lenovo.com.cn/statement/salesagreement.html'>销售条款</a>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className='tracking-[10px] pointer-events-auto mt-1 my-[8px_auto_10px] bg-gradient-to-r from-[#f22d18] to-[#e53939] border-0 rounded-[4px] shadow-[0_4px_10px_0_hsla(3,45%,67%,.49)] text-white cursor-pointer text-[16px] font-normal h-[56px] text-center w-[370px]'>登录</button>
                                        <div className='flex items-center text-[#252525] text-[13px] font-normal justify-end tracking-[0]'>
                                            <span className='cursor-pointer'>登陆账号</span>
                                            <span className='cursor-pointer ml-[3px] relative after:content-["\003E"]'></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reg