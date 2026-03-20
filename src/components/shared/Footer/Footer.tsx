import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <div>
      <div className="bg-primary">
        <div className="py-7 md:py-8 lg:py-10 container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-5 md:gap-6 ">
          <div className="md:col-span-3">
            {/* Logo */}
            <Link href="/" className="">
              <Image
                src="/assets/images/footer_logo.png"
                alt="logo"
                width={1000}
                height={1000}
                className="w-auto h-[50px] object-contain rounded-[4px]"
              />
            </Link>
            <p className="max-w-[300px] text-sm md:text-base text-white leading-normal font-normal pt-4">
              Your smart vehicle history assistant. Combining trusted vehicle
              databases with intelligent AI insights to help you buy with
              confidence.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="hidden md:block text-lg md:text-xl font-semibold text-white leading-[120%] pb-4">
              Quick Links
            </h4>
            <ul>
              <Link href="/">
                <li className="text-sm md:text-base font-normal text-white leading-[120%] hover:underline hover:text-primary">
                  Home
                </li>
              </Link>
              <Link href="/contact-us">
                <li className="text-sm md:text-base font-normal text-white leading-[120%] hover:underline hover:text-primary py-2">
                  Contact Us
                </li>
              </Link>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="hidden md:block text-lg md:text-xl font-semibold text-white leading-[120%] pb-4">
              Legal
            </h4>
            <ul>
              <Link href="/terms-and-condition">
                <li className="text-sm md:text-base font-normal text-white leading-[120%] hover:underline hover:text-primary">
                  Terms & Condition
                </li>
              </Link>
              <Link href="/privacy-policy">
                <li className="text-sm md:text-base font-normal text-white leading-[120%] hover:underline hover:text-primary py-2">
                  Privacy Policy
                </li>
              </Link>
            </ul>
          </div>
          <div className="md:col-span-3">
            {/* Title */}
            <h4 className="hidden md:block text-lg md:text-xl font-semibold text-white leading-[120%] pb-4">
              Contact Us
            </h4>

            {/* Address */}
            {/* <div className="flex items-start gap-4 mb-3">
              <MapPin className="w-6 h-6 text-white mt-1" />
              <Link
                href="https://maps.google.com/?q=123 Research Blvd, Science Park, CA 94000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base leading-normal font-normal text-white"
              >
                123 Research Blvd, <br />
                Science Park, CA 94000
              </Link>
            </div> */}

            {/* Phone */}
            <div className="flex items-center gap-4 mb-3">
              <Phone className="w-6 h-6 text-white" />
              <Link
                href="tel:+1 (555) 123-4567FGHJ"
                className="text-sm md:text-base leading-normal font-normal text-white"
              >
                +1 (555) 123-4567FGHJ
              </Link>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-white" />
              <Link
                href="mail:help@vehicle.check.com"
                className="text-sm md:text-base leading-normal font-normal text-white"
              >
                help@vehicle.check.com
              </Link>
            </div>
          </div>
        </div>
          {/* footer bottom  */}
      <p className="container text-sm md:text-base font-medium text-center text-[#E2E2E2] leading-[120%] py-6 border-t border-[#98A4C9]">
        Copyright © {new Date().getFullYear()}. Vehicle.Check. All rights reserved.
      </p>
      </div>
    
    </div>
  );
};

export default Footer;
