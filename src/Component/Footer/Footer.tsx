import React from 'react';
import FooterBanner from './FooterBanner';
import FooterLinksSection from './FooterLinksSection';

interface Link {
    text: string;
    url: string;
}

interface LinkColumn {
    title: string;
    links: Link[];
}


const Footer: React.FC = () => {
    // 链接列数据
    const linkColumns:LinkColumn[] = [
        {
            title: "配送方式",
            links: [
                { text: "配送方式", url: "/" },
                { text: "配送方式", url: "/" },
                { text: "配送方式", url: "/" },
                { text: "配送方式", url: "/" }
            ]
        },
        {
            title: "支付方式",
            links: [
                { text: "支付方式", url: "/" },
                { text: "支付方式", url: "/" },
                { text: "支付方式", url: "/" },
                { text: "支付方式", url: "/" }
            ]
        },
        {
            title: "售后服务",
            links: [
                { text: "售后服务", url: "/" },
                { text: "售后服务", url: "/" },
                { text: "售后服务", url: "/" },
                { text: "售后服务", url: "/" }
            ]
        },
        {
            title: "关于我们",
            links: [
                { text: "关于我们", url: "/" },
                { text: "关于我们", url: "/" },
                { text: "关于我们", url: "/" },
                { text: "关于我们", url: "/" }
            ]
        },
        {
            title: "帮助中心",
            links: [
                { text: "帮助中心", url: "/" },
                { text: "帮助中心", url: "/" },
                { text: "帮助中心", url: "/" },
                { text: "帮助中心", url: "/" }
            ]
        },
        {
            title: "商务合作",
            links: [
                { text: "商务合作", url: "/" },
                { text: "商务合作", url: "/" },
                { text: "商务合作", url: "/" },
                { text: "商务合作", url: "/" }
            ]
        }
    ];

    // 联系信息
    const contactInfo = {
        phone: "114-514-6666",
        serviceHours: "周一到周日 9:00-21:00",
        qrCodeImageUrl: "https://p2.lefile.cn/fes/cms/2023/08/18/so5dpk1q87ts4accm4njazli6hqfmz404012.png"
    };

    return (
        <div className='w-full mx-auto relative'>
            {/* <FooterBanner
                imageUrl="https://p3.lefile.cn/fes/cms/2023/08/18/jpjvfnpt30mzh348l8j7nqh4py7buw745316.png"
                altText="Footer Banner"
            />

            <div className='w-full bg-white pb-3' />

            <FooterLinksSection
                linkColumns={linkColumns}
                contactInfo={contactInfo}
            /> */}
        </div>
    );
};

export default Footer;
