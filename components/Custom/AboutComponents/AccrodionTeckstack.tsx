import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Teckstack() {
  return (
    <Accordion type="single" collapsible className="w-full mt-3">
      <AccordionItem value="item-1">
        <AccordionTrigger>Tech stack Project</AccordionTrigger>
        <AccordionContent>HTML</AccordionContent>
        <AccordionContent>CSS</AccordionContent>
        <AccordionContent>Node.js</AccordionContent>
        <AccordionContent>Express.js</AccordionContent>
        <AccordionContent>Rest API</AccordionContent>
        <AccordionContent>MongoDB</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
