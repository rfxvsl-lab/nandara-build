import { Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/content/site";

/** Daftar tanya-jawab bergaya Block: garis pemisah, ikon + yang berputar saat dibuka. */
export function FaqList() {
  return (
    <Accordion type="single" collapsible>
      {FAQ.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`} className="border-batu">
          <AccordionTrigger className="gap-6 py-5 text-left text-[1.0625rem] font-normal text-arang hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]_.faq-plus]:rotate-45">
            {item.q}
            <Plus
              className="faq-plus h-5 w-5 shrink-0 text-abu transition-transform duration-200"
              aria-hidden
            />
          </AccordionTrigger>
          <AccordionContent className="max-w-[60ch] pb-6 pr-10 text-[0.9375rem] leading-relaxed text-abu">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
