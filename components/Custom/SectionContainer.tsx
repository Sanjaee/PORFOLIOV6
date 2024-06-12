import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SectionContainer({ children }: Props) {
  return (
    <div className="mx-auto max-w-3xl mb-20 px-4 sm:px-9 xl:max-w-5xl xl:px-0">
      {children}
    </div>
  );
}
