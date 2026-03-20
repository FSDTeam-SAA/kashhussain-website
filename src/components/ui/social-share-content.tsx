"use client";

import { useState, useEffect } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import { Share2 } from "lucide-react";

interface ShareComponentProps {
  postId: string; 
}

const SocialShareContent: React.FC<ShareComponentProps> = ({
  postId
}) => {
  const [open, setOpen] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/player-profile/${postId}`
      : "";

  const toggleShare = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".share-container")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2 share-container">
      {/* Share Button */}
      <button
        type="button"
        onClick={toggleShare}
        className="w-full h-[40px] bg-primary flex items-center justify-center gap-2 rounded-full text-base font-normal text-white px-6"
      >
        Share <Share2 size={18} />
      </button>

      {/* Social Icons */}
      {open && (
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 z-50 
          bg-white shadow-lg rounded-xl p-3 flex gap-3"
        >
          <FacebookShareButton url={shareUrl} title="kongkon">
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} >
            <TwitterIcon size={40} round />
          </TwitterShareButton>

          <WhatsappShareButton url={shareUrl} >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <LinkedinShareButton
            url={shareUrl}
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          <TelegramShareButton url={shareUrl}>
            <TelegramIcon size={40} round />
          </TelegramShareButton>
        </div>
      )}
    </div>
  );
};

export default SocialShareContent;

