import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  export function AccTesti() {
    return (
      <Accordion type="single" collapsible className="w-full mt-3">
        <AccordionItem value="item-1">
          <AccordionTrigger>Tech stack Project</AccordionTrigger>
          <AccordionContent>React.js</AccordionContent>
          <AccordionContent>Framer Motion</AccordionContent>
          <AccordionContent>Laravel</AccordionContent>
          <AccordionContent>Filament</AccordionContent>
          <AccordionContent>Tailwind CSS</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
  