import { Link } from 'react-router-dom';

const FlashSale = () => {

  const time = {
    time: '12:00',
    time1: '12',
    time2: '00',
    time3: '00',
  }

  return (
    <div className='w-full mx-auto my-0 relative'>
      <div className='pt-[20px]'>
        <div className="relative w-[1200px] h-[340px] mx-auto my-0">
          <Link to={''}>
            <div className=' absolute left-0 w-[230px] h-[340px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/11/26/2b4b9fee-84ee-4fb1-9891-3b3390fb5fd5.png)] bg-[length:230px_340px]'>
              <div className='mt-[44px] text-center'>
                <i className=' inline-block w-[120px] h-[27px] bg-[url(https://p1.lefile.cn/product/adminweb/2019/11/26/72f84116-d80c-4fb3-a39e-ae16271f6c76.png)]
                bg-[length:120px_27px]'></i>
              </div>
              <div className='text-center'>
                <i className=' inline-block mt-[22px] w-[28px] h-[60px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/12/11/eb749e1e-e9fa-48ba-95a9-b2041ad01154.png)]
                bg-[length:28px_60px]'></i>
              </div>
              <div className='mt-[14px] text-center'>
                <div className=' hidden'>
                  <span className='text-[20px] text-white font-semibold'> {time.time || '12:00'}</span>
                  <span className='text-[20px] text-white font-semibold'> 场</span>
                  <div className='text-[16px] text-white font-semibold'> 距结束还剩
                  </div>
                  <div className='mt-[18px] text-center'>
                    <i className='text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mr-1 ml-1'>{time.time1 || '12'}</i>
                    <i className='text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mr-1 ml-1'>{time.time2 || '00'}</i>
                    <i className='text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mr-1 ml-1'>{time.time3 || '00'}</i>
                  </div>

                </div>
                <div className=' block'>
                  <span className='text-[20px] text-white font-semibold'> {time.time || '12:00'}</span>
                  <span className='text-[20px] text-white font-semibold'> 场</span>
                  <div className='text-[16px] text-white font-semibold'> 明日开始
                  </div>
                  <div className='mt-[18px] text-center'>
                    <i className='text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mr-1 ml-1'>{time.time1 || '12'}</i>
                    <i className='text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mr-1 ml-1'>{time.time2 || '00'}</i>
                    <i className='text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mr-1 ml-1'>{time.time3 || '00'}</i>
                  </div>

                </div>

              </div>
            </div>

          </Link>
          <div className='w-[918px] absolute left-[230px] right-[49px] overflow-hidden bg-white '>
            <div className='h-[66px] leading-[66px] bg-white border-b border-b-[#e8e8e8]  '>
              <ul className=' overflow-hidden h-full ml-[22px] text-[0px] list-none'>
                <li className='bg-gradient-to-r from-[#ec1111] to-[#ff8200] rounded-[13px] text-white inline-block w-[164px] h-[26px] leading-[26px] mr-[10px] align-middle text-[14px] font-semibold cursor-pointer'>
                  <div className='text-center'>
                    <span>
                      12:00
                    </span>
                    <i>
                      场
                    </i>-
                    <span>
                      正在抢购
                    </span>
                  </div>
                </li>
                <li className='bg-gradient-to-r from-[#ec1111] to-[#ff8200] rounded-[13px] text-white inline-block w-[164px] h-[26px] leading-[26px] mr-[10px] align-middle text-[14px] font-semibold cursor-pointer'>
                  <div className='text-center'>
                    <span>
                      12:00
                    </span>
                    <i>
                      场
                    </i>-
                    <span>
                      明日开始
                    </span>
                  </div>
                </li>
              </ul>


            </div>

            <div className='my-0 ml-[23px] mr-0'>
              <div className='m-0'>
                <ul className='w-full text-[0px] h-[273px] overflow-hidden list-none'>

                  <li className='w-[195px] inline-block mr-[23px] mt-[17px] border-r border-[#e8e8e8] pr-[10px] list-none'>
                    <Link to={''} className='inline-block no-underline'>
                      <div className='w-[160px] h-[160px] leading-[160px] text-center mx-auto'>
                        <img src="	https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg" alt="" className='inline-block align-middle max-w-[160px] border-0' />
                      </div>
                      <div className='mt-[9px]'>
                        <span className='inline-block w-[192px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-[#242424] font-semibold'>联想有线鼠标 M280</span>
                      </div>
                      <div className='mt-1 h-[18px] relative'>
                        <div className='block absolute bg-[#ffe7e4] w-auto h-4 leading-4 border border-[#ffe7e4] rounded'>
                          <i className='inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] mt-[1.5px] ml-[2px]'></i>
                          <span className='inline-block text-xs text-[#ff2f2f] left-[17px] align-top mx-[3px]'>4.6折</span>
                        </div>
                      </div>
                      <div className='mt-[7px]'>
                        <div className='inline-block mr-[11px]'>
                          <span className='text-base text-[#e72d21] font-bold '>¥</span>
                          <span className='text-base text-[#e2231a] font-semibold'>9.9</span>
                        </div>
                        <div className='inline-block text-[0px] text-[#858585]'>
                          <span className='text-sm text-[#858585]  font-bold '>¥</span>
                          <span className='text-sm text-[#858585] line-through'>29.9</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className='w-[195px] inline-block mr-[23px] mt-[17px] border-r border-[#e8e8e8] pr-[10px] list-none'>
                    <Link to={''} className='inline-block no-underline'>
                      <div className='w-[160px] h-[160px] leading-[160px] text-center mx-auto'>
                        <img src="	https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg" alt="" className='inline-block align-middle max-w-[160px] border-0' />
                      </div>
                      <div className='mt-[9px]'>
                        <span className='inline-block w-[192px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-[#242424] font-semibold'>联想有线鼠标 M280</span>
                      </div>
                      <div className='mt-1 h-[18px] relative'>
                        <div className='block absolute bg-[#ffe7e4] w-auto h-4 leading-4 border border-[#ffe7e4] rounded'>
                          <i className='inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] mt-[1.5px] ml-[2px]'></i>
                          <span className='inline-block text-xs text-[#ff2f2f] left-[17px] align-top mx-[3px]'>4.6折</span>
                        </div>
                      </div>
                      <div className='mt-[7px]'>
                        <div className='inline-block mr-[11px]'>
                          <span className='text-base text-[#e72d21] font-bold '>¥</span>
                          <span className='text-base text-[#e2231a] font-semibold'>9.9</span>
                        </div>
                        <div className='inline-block text-[0px] text-[#858585]'>
                          <span className='text-sm text-[#858585]  font-bold '>¥</span>
                          <span className='text-sm text-[#858585] line-through'>29.9</span>
                        </div>
                      </div>
                    </Link>
                  </li> <li className='w-[195px] inline-block mr-[23px] mt-[17px] border-r border-[#e8e8e8] pr-[10px] list-none'>
                    <Link to={''} className='inline-block no-underline'>
                      <div className='w-[160px] h-[160px] leading-[160px] text-center mx-auto'>
                        <img src="	https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg" alt="" className='inline-block align-middle max-w-[160px] border-0' />
                      </div>
                      <div className='mt-[9px]'>
                        <span className='inline-block w-[192px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-[#242424] font-semibold'>联想有线鼠标 M280</span>
                      </div>
                      <div className='mt-1 h-[18px] relative'>
                        <div className='block absolute bg-[#ffe7e4] w-auto h-4 leading-4 border border-[#ffe7e4] rounded'>
                          <i className='inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] mt-[1.5px] ml-[2px]'></i>
                          <span className='inline-block text-xs text-[#ff2f2f] left-[17px] align-top mx-[3px]'>4.6折</span>
                        </div>
                      </div>
                      <div className='mt-[7px]'>
                        <div className='inline-block mr-[11px]'>
                          <span className='text-base text-[#e72d21] font-bold '>¥</span>
                          <span className='text-base text-[#e2231a] font-semibold'>9.9</span>
                        </div>
                        <div className='inline-block text-[0px] text-[#858585]'>
                          <span className='text-sm text-[#858585]  font-bold '>¥</span>
                          <span className='text-sm text-[#858585] line-through'>29.9</span>
                        </div>
                      </div>
                    </Link>
                  </li> <li className='w-[195px] inline-block mr-[23px] mt-[17px] border-r border-[#e8e8e8] pr-[10px] list-none'>
                    <Link to={''} className='inline-block no-underline'>
                      <div className='w-[160px] h-[160px] leading-[160px] text-center mx-auto'>
                        <img src="	https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg" alt="" className='inline-block align-middle max-w-[160px] border-0' />
                      </div>
                      <div className='mt-[9px]'>
                        <span className='inline-block w-[192px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-[#242424] font-semibold'>联想有线鼠标 M280</span>
                      </div>
                      <div className='mt-1 h-[18px] relative'>
                        <div className='block absolute bg-[#ffe7e4] w-auto h-4 leading-4 border border-[#ffe7e4] rounded'>
                          <i className='inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] mt-[1.5px] ml-[2px]'></i>
                          <span className='inline-block text-xs text-[#ff2f2f] left-[17px] align-top mx-[3px]'>4.6折</span>
                        </div>
                      </div>
                      <div className='mt-[7px]'>
                        <div className='inline-block mr-[11px]'>
                          <span className='text-base text-[#e72d21] font-bold '>¥</span>
                          <span className='text-base text-[#e2231a] font-semibold'>9.9</span>
                        </div>
                        <div className='inline-block text-[0px] text-[#858585]'>
                          <span className='text-sm text-[#858585]  font-bold '>¥</span>
                          <span className='text-sm text-[#858585] line-through'>29.9</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

            </div>



          </div>
          <div className='absolute right-0 w-[49px] h-[340px] bg-gradient-to-br from-[#ec1111] from-1% to-[#ff8200] to-99%'>
            <div className="absolute inset-0 m-auto w-[18px] h-[106px] text-sm text-white text-center cursor-pointer">
              <Link to={''} className=' inline-block no-underline'>
                <span className='text-white'>更多秒杀</span>
                <i className='inline-block w-[18px] h-[18px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/11/26/3a702767-4b0a-4e74-a14e-8ddcf5b26609.png)] bg-[length:18px_18px] mt-[11px]'></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default FlashSale;
