import clsx from "clsx";
import { IPageContainerProps } from "./@types";
import React from "react";

export function PageContainer({
  size = "base",
  ...props
}: IPageContainerProps) {
  let dimensions =
    "md:max-w-[620px] lg:max-w-[840px] xl:max-w-[960px] 2xl:max-w-[1320px]";

  if (size === "large")
    dimensions =
      "md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]";

  return (
    <div
      {...props}
      className={clsx(props.className, dimensions, "container mx-auto px-4")}
    >
      {props.children}
    </div>
  );
}
