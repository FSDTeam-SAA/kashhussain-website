import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
// import ScrollToTopComponent from "@/components/shared/ScrollToTop/ScrollToTop";
import React from "react";

const WebsiteLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="">
      <Navbar />
      <main className="min-h-screen">
        {children}
        {/* <ScrollToTopComponent /> */}
      </main>
     <Footer />
    </div>
  );
};

export default WebsiteLayout;
