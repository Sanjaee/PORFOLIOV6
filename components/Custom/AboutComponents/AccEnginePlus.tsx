import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  export function AccEnginePlus() {
    return (
      <Accordion type="single" collapsible className="w-full mt-3">
        <AccordionItem value="item-1">
          <AccordionTrigger>Tech stack Project</AccordionTrigger>
          <AccordionContent>HTML</AccordionContent>
          <AccordionContent>CSS</AccordionContent>
          <AccordionContent>Bootstrap</AccordionContent>
          <AccordionContent>Jquery</AccordionContent>
          <AccordionContent>CodeIgniter 3</AccordionContent>
          <AccordionContent>PostgreSQL</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
  