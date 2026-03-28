


"use client"

import { useState } from "react"
import Link from "next/link"
import { LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
// import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  // DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import LogoutModal from "@/components/modals/LogoutModal"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { UserApiResponse } from "@/app/(website)/personal-information/_components/personal-info-data-type"
// import { useRouter } from "next/navigation"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  // const router = useRouter()


  const session = useSession()
   const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const status = session?.status
  const user = session?.data?.user
 

  // get api
  const { data } = useQuery<UserApiResponse>({
    queryKey: ["update-profile"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!token,
  });

  

  const handLogout = async () => {
    try {
      toast.success("Logout successful!")
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <div className="sticky top-0 z-50">
      <header className="w-full bg-[#F8FAFC]">
        <nav className="container mx-auto px-4 py-3 ">
          <div className="flex items-center justify-between gap-5">
           {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={1000}
                height={1000}
                className="w-auto h-[60px] object-contain"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm md:text-[15px] hover:text-primary leading-[150%] text-[#131313] font-normal transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                Home
              </Link>


              <Link
                href="/contact-us"
                className={`text-sm md:text-[15px] hover:text-primary leading-[150%] text-[#131313] font-normal transition-all ease-in-out duration-300 ${pathname === "/contact-us" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                Contact Us
              </Link>

            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
              {status === "authenticated" && user ? (
                <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
                  <DropdownMenuTrigger>
                    <Image
                      src={data?.data?.profilePicture || "/assets/images/no-user.jpg"}
                      alt="user-img"
                      width={200}
                      height={200}
                      className="w-14 h-14 rounded-full border object-contain"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2 border-none bg-white">
                    <Link href="/personal-information">
                      <DropdownMenuLabel className="cursor-pointer text-base md:text-lg text-[#131313] leading-[120%] font-medium hover:text-primary">
                        Personal Infomation
                      </DropdownMenuLabel>
                    </Link>
                    <Link href="/change-password">
                      <DropdownMenuLabel className="cursor-pointer text-base md:text-lg text-[#131313] leading-[120%] font-medium hover:text-primary">
                        Change Password
                      </DropdownMenuLabel>
                    </Link>
                    <Link href="/your-check">
                      <DropdownMenuLabel className="cursor-pointer text-base md:text-lg text-[#131313] leading-[120%] font-medium hover:text-primary">
                        Your Check
                      </DropdownMenuLabel>
                    </Link>
                    <DropdownMenuLabel
                      onClick={() => setLogoutModalOpen(true)}
                      className="flex items-center gap-2 cursor-pointer text-base md:text-lg text-[#B70000] leading-[120%] font-medium hover:text-red-800"
                    >
                      <LogOut className="w-5 h-5 " /> Logout
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-[44px] hover:bg-primary hover:text-white text-base text-primary font-medium leading-[150%] border border-primary py-2 px-5 rounded-[8px]"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="sm"
                      className="h-[44px] py-2 px-5 rounded-[8px] bg-primary hover:bg-transparent border border-primary hover:text-primary text-white text-base font-normal leading-[150%] "
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mt-4 md:hidden flex flex-col space-y-3 pb-4">

              <Link
                href="/"
                className={`w-fit text-sm md:text-base hover:text-primary leading-[150%] text-[#131313] font-normal transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary" : "border-0"
                  }`}
              >
                Home
              </Link>

              <Link
                href="/contact-us"
                className={`w-fit text-sm md:text-base hover:text-primary leading-[150%] text-[#131313] font-normal transition-all ease-in-out duration-300 ${pathname === "/analytic-soccer-coming-soon" ? "border-b-[2px] border-primary" : "border-0"
                  }`}
              >
                Contact Us
              </Link>


              <div className="flex items-center justify-between gap-4 pt-2">
                {status === "authenticated" && user ? (
                  <DropdownMenu
                    open={mobileDropdownOpen}
                    onOpenChange={setMobileDropdownOpen}
                    modal={false}
                  >
                    <DropdownMenuTrigger>
                      <Image
                        src={user?.profileImage || "/assets/images/no-user.jpg"}
                        alt="user-img"
                        width={200}
                        height={200}
                        className="w-14 h-14 rounded-full border object-contain"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2 bg-white border-white">
                      <Link
                        href="/personal-information"
                        onClick={() => {
                          setIsOpen(false)
                          setMobileDropdownOpen(false)
                        }}
                      >
                        <DropdownMenuLabel className="cursor-pointer text-base md:text-lg text-[#131313] leading-[120%] font-medium hover:text-primary">
                          Personal Information
                        </DropdownMenuLabel>
                      </Link>
                      <Link
                        href="/change-password"
                        onClick={() => {
                          setIsOpen(false)
                          setMobileDropdownOpen(false)
                        }}
                      >
                        <DropdownMenuLabel className="cursor-pointer text-base md:text-lg text-[#131313] leading-[120%] font-medium hover:text-primary">
                          Change Password
                        </DropdownMenuLabel>
                      </Link>
                        <Link
                        href="/your-check"
                        onClick={() => {
                          setIsOpen(false)
                          setMobileDropdownOpen(false)
                        }}
                      >
                        <DropdownMenuLabel className="cursor-pointer text-base md:text-lg text-[#131313] leading-[120%] font-medium hover:text-primary">
                          Your Check
                        </DropdownMenuLabel>
                      </Link>
                      <DropdownMenuLabel
                        onClick={() => setLogoutModalOpen(true)}
                        className="flex items-center gap-2 cursor-pointer text-base md:text-lg text-[#B70000] leading-[120%] font-medium hover:text-red-800"
                      >
                        <LogOut className="w-5 h-5 " /> Logout
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-[40px] text-base text-[#131313] font-normal leading-[150%] border-[2px] border-[#131313] py-2 px-9 rounded-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button
                        size="sm"
                        className="h-[40px] py-2 px-9 rounded-full bg-primary hover:bg-primary/90 text-white text-base font-normal leading-[150%] "
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </div>
  )
}

export default Navbar