import React from "react";

interface Props {
  label?: string;
}

export const Divider: React.FC<Props> = ({label = "ou"}) => {
  return (
    <div className="flex items-center w-full">
      <div className="w-full border-t border-gray-300"></div>
      <span className="mx-3 text-muted-foreground">{label}</span>
      <div className="w-full border-t border-gray-300"></div>
    </div>
  );
};
