import React from 'react'
import { assets, footerLinks } from '../assets/assets';

const Footer = () => {
  const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook", "YouTube"]
        }
    ];

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 ">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="dummyLogoColored" />
                    <p className="max-w-[410px] text-black mt-6">Fresh groceries delivered to your doorstep, fast and hassle-free. We source quality produce, daily essentials, and household items so you can shop smarter and live better. Experience convenience, freshness, and savings – all in one place.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base  md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base ">
                Copyright {new Date().getFullYear()} © Rajnish  All Right Reserved.
            </p>
        </div>
    );
}

export default Footer