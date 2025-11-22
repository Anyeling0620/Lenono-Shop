import React from 'react'


interface AuthBackgroundProps {
    children: React.ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
    return (
        <div className="text-[12px] m-0 p-0">
            <div className="h-[100%] w-[100%] block">
                <div className="bg-[url(https://p1.lefile.cn/lenovo_auth/login_adbg.jpg)] bg-no-repeat bg-center bg-[length:1920px_800px] h-[800px] relative w-[100%]">
                    <div className="box-border h-[100%] mx-auto pt-16 w-[1200px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthBackground