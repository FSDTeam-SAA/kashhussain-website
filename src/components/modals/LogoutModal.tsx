import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type logoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal = ({ isOpen, onClose, onConfirm }: logoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] md:max-w-[420px] bg-white !rounded-[12px]">
        <DialogHeader>
          <DialogTitle className="dark:text-black text-lg md:text-xl pt-1">Are you sure you want to log out?</DialogTitle>
          <DialogDescription className="dark:text-black text-sm md:text-base pt-1">
            You are about to log out of your account. You will need to log in
            again to continue using the services.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex flex-row items-center justify-between gap-7 mt-3 md:mt-5">
          <button
            className="text-white  bg-black py-[8px] px-6 text-sm font-medium leading-[120%] rounded-[8px]"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="text-base font-medium bg-primary text-white leading-[120%] py-[8px] px-[18px] rounded-[8px] shadow-none border-none"
            onClick={onClose}
          >
            No
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;