import { Coffee, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#2C1810] text-stone-400 py-24 mt-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
        <Coffee size={800} strokeWidth={1} />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 p-2.5 rounded-2xl">
                <Image
                  src="/logo.jpg"
                  alt="logo"
                  width={48}
                  height={48}
                  className="transform group-hover:rotate-12 transition-transform duration-300 rounded-sm"
                />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                COFFEE HUB
              </h1>
            </div>
            <p className="text-stone-500 text-lg max-w-sm leading-relaxed mb-8">
              Dedicated to the craft of perfect roasting and the community of
              coffee lovers everywhere. Visit us for an unforgettable
              experience.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white cursor-pointer transition-all">
                <Facebook size={20} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-linear-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-white cursor-pointer transition-all">
                <Instagram size={20} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-blue-500 cursor-pointer transition-all">
                <Twitter size={20} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">
              Quick Links
            </h4>
            <ul className="space-y-4 font-medium">
              <li>
                <Link href="#" className="hover:text-[#D4A373] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#D4A373] transition-colors">
                  Brewing Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#D4A373] transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#D4A373] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">
              Support
            </h4>
            <ul className="space-y-4 font-medium">
              <li>
                <a href="#" className="hover:text-[#D4A373] transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4A373] transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4A373] transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D4A373] transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
          <p>© 2025 Coffee Hub. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
