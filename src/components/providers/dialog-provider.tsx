"use client";

import React, { createContext, useContext, useState } from "react";
import { DonationDialog } from "@/components/donate/donation-dialog";

type DialogContextType = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ isOpen, setOpen }}>
      {children}
      <DonationDialog />
    </DialogContext.Provider>
  );
};
