"use client";
import React, { useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import { ArrowUp, ChevronsUp } from "lucide-react";

const ScrollToTopComponent = () => {
  const [hoverIcon, setHoverIcon] = useState(false);
  return (
    <div>
      <ScrollToTop
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #0078F0",
          background: "white",
          padding: "5px",
        }}
        smooth
        component={
          hoverIcon ? (
            <ArrowUp className="w-[30px] h-[30px] text-primary" />
          ) : (
            <ChevronsUp  className="w-[30px] h-[30px] text-primary" />
          )
        }
        onMouseEnter={()=>setHoverIcon(true)}
        onMouseLeave={()=>setHoverIcon(false)}
      />
    </div>
  );
};

export default ScrollToTopComponent;
