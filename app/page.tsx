import Contact from "@/components/Custom/Main/Contact";
import GitHubContributionGraph from "@/components/Custom/Main/GitHubCalendar";
import Hero from "@/components/Custom/Main/Hero";
import Intro from "@/components/Custom/Main/intro";
import SkillList from "@/components/Custom/Main/Marque/SkillList";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SkillList />
      <GitHubContributionGraph />
      <Contact />
    </>
  );
}
