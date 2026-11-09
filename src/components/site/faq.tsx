import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/content/site";

export function FaqList() {
  return (
    <Accordion type="single" collapsible className="border-t border-batu">
      {FAQ.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`} className="border-batu">
          <AccordionTrigger className="gap-4 py-5 text-base font-semibold text-arang hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-emas-ink">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="max-w-[65ch] pb-6 text-[0.9375rem] leading-relaxed text-abu">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
