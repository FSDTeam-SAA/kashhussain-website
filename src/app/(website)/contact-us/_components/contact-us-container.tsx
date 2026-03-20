import React from "react";
import ContactForm from "./contact-form";
import Image from "next/image";

const ContactInformation = () => {
  return (
    <div className="bg-[#F6FBFF]">
      <div className="bg-[linear-gradient(135deg,_#EAF5FF_25%,_#CFE1FF_60.36%,_#C6CCDD_95.71%)] py-10 md:py-14 lg:py-20 px-4 md:px-0">
        <h3 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-primary leading-normal text-center">
          We&#39;d Love to Hear From You
        </h3>
        <p className="w-full md:w-1/2 mx-auto text-sm md:text-base text-[#6B7280] font-normal leading-normal text-center pt-2">
          Have questions or feedback? Reach out anytime. We&apos;re here to help
          you on your journey.
        </p>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
          {/* Left Content */}
          <div className="order-2 md:order-1">
            <div className="">
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-[110%] text-primary ">
                Get in Touch
              </h2>
              <p className="mt-2 text-sm md:text-base leading-normal font-normal text-[#6B7280]">
                Fill out the form below and we&apos;ll get back to you soon
              </p>
            </div>

            <div className="mt-4">
              <ContactForm />
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full flex items-center justify-end relative order-1 md:order-2 ">
             <Image
                src="/assets/images/contact_us_bg.png"
                alt="Luxury car"
                width={1000}
                height={1000}
                className="w-auto h-[400px] md:h-[500px] lg:h-[540px] object-contain"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
