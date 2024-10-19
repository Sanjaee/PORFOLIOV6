import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccSlicing() {
  return (
    <Accordion type="single" collapsible className="w-full mt-3">
      <AccordionItem value="item-1">
        <AccordionTrigger>Tech stack Project</AccordionTrigger>
        <AccordionContent>HTML</AccordionContent>
        <AccordionContent>CSS</AccordionContent>
        <AccordionContent>Tailwind</AccordionContent>
        <AccordionContent>React.js</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
