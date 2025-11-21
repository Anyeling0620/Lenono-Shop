import React from 'react';
import FooterLinkColumn from './FooterLinkColumn';
import FooterContact from './FooterContact';

interface LinkColumnData {
  title: string;
  links: Array<{ text: string; url: string }>;
}

interface FooterLinksSectionProps {
  linkColumns: LinkColumnData[];
  contactInfo: {
    phone: string;
    serviceHours: string;
    qrCodeImageUrl?: string;
  };
}

const FooterLinksSection: React.FC<FooterLinksSectionProps> = ({ 
  linkColumns, 
  contactInfo 
}) => {
  return (
    <div className='bg-[#fbfbfb] w-full text-[#ccc]'>
      <ul className='w-[1200px] m-auto p-[70px_0_70px_76px] relative box-content overflow-hidden'>
        {linkColumns.map((column, index) => (
          <FooterLinkColumn
            key={index}
            title={column.title}
            links={column.links}
          />
        ))}
        <FooterContact
          phone={contactInfo.phone}
          serviceHours={contactInfo.serviceHours}
          qrCodeImageUrl={contactInfo.qrCodeImageUrl}
        />
      </ul>
    </div>
  );
};

export default FooterLinksSection;
