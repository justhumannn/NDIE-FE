import React from "react";

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function ContentContainer({children, className}:ContainerProps) {
  return (
    <div className={`${className} w-full overflow-hidden relative bg-[#F8F8F8] px-4 md:px-20 lg:px-40 py-10 md:py-20`}>
      {children}
    </div>
  )
}