"use client";

import { ReactNode } from "react";
import SectionContainer from "./SectionContainer";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return <SectionContainer>{children}</SectionContainer>;
}
