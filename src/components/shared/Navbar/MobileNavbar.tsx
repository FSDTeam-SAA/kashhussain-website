"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { navLinks } from "@/components/utils/navLinks";

const MobileNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-10 w-10" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" onClick={closeSheet}>
                <Image
                  src={"/assets/images/logo.jpg"}
                  alt="logo"
                  width={1000}
                  height={1000}
                  className="h-[60px] w-[150px]"
                />
              </Link>
            </div>

            <nav className="flex-1">
              <ul className="space-y-4">
                {navLinks.map((item, index) => {
                  const isActive = item.link === pathname;

                  // Normal links
                  return (
                    <li key={index}>
                      <Link
                        href={item.link}
                        onClick={closeSheet}
                        className={`block p-3 rounded-lg font-medium transition-all duration-300 text-left ${
                          isActive
                            ? "bg-[#e7e7e7] text-primary"
                            : "hover:bg-[#f5f5f5]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="pt-5 flex flex-col gap-4">
                         <Link href="/login">
                           <Button variant="ghost" size="sm" className="w-full h-[40px] hover:bg-primary text-base text-[#131313] hover:text-white font-normal leading-[150%] border-[2px] border-[#131313] py-2 px-12 rounded-full">
                             Sign In
                           </Button>
                         </Link>
                         <Link href="/sign-up">
                           <Button size="sm" className="w-full h-[40px] py-2 px-12 rounded-full bg-primary hover:bg-primary/90 text-white text-base font-normal leading-[150%] ">
                             Register
                           </Button></Link>
                       
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;