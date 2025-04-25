
import React from "react";
import { Button } from "@/components/ui/button";

interface ShowAllButtonProps {
  onClick: () => void;
  label: string;
  isActive: boolean;
}

const ShowAllButton = ({ onClick, label, isActive }: ShowAllButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={isActive 
        ? "bg-bh-navy hover:bg-bh-navy/90" 
        : "text-bh-navy border-bh-slate/30 hover:bg-secondary"}
    >
      {label}
    </Button>
  );
};

export default ShowAllButton;
