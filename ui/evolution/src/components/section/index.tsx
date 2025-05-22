import clsx from "clsx";
import { ISectionProps } from "./@types";
import React from "react";

export function Section({ className, children }: ISectionProps) {
  return <section className={clsx(className, "")}>{children}</section>;
}
