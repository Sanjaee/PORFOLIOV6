import Contact from "@/components/Custom/Main/Contact";
import Footer from "@/components/Custom/Main/Footer";
import Hero from "@/components/Custom/Main/Hero";
import Intro from "@/components/Custom/Main/intro";
import { Works } from "@/components/Custom/Main/Works";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Works />
      <Contact />
      <Footer />
    </>
  );
}
