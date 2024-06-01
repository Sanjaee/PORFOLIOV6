import LenisProvider from "@/components/Custom/LenisProvider";
import Hero from "@/components/Custom/Main/Hero";
import Intro from "@/components/Custom/Main/intro";

import Works from "@/components/Custom/Main/Works";

export default function Home() {
  return (
    <>
      <LenisProvider>
        <Hero />
        <Intro />
        <Works />
      </LenisProvider>
    </>
  );
}
