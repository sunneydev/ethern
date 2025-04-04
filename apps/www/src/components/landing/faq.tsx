"use client";

import { usePlausible } from "next-plausible";
import { fixtures } from "~/lib/fixtures";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/ui/accordion";

export function FAQItem({
  question,
  answer,
  item,
  onClick,
}: {
  item: number;
  question: string;
  answer: string | JSX.Element;
  onClick: () => void;
}) {
  return (
    <AccordionItem
      value={`item-${item}`}
      className="sm:p-4"
      borderProps={{
        className: "bg-gradient-to-r from-black via-white/30 to-black h-px",
      }}
    >
      <AccordionTrigger
        className="text-left text-base font-normal text-white/90 sm:text-xl sm:font-bold sm:text-white"
        onClick={onClick}
      >
        {question}
      </AccordionTrigger>
      <AccordionContent className="items-start text-left text-sm text-white/50 sm:justify-start sm:text-white/80 md:text-base">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export function FAQ() {
  const p = usePlausible();

  return (
    <Accordion type="single" collapsible>
      {fixtures.faq.map(({ answer, question }, i) => (
        <FAQItem
          key={i}
          item={i}
          question={question}
          answer={answer}
          onClick={() => p("faq-view", { props: { question } })}
        />
      ))}
    </Accordion>
  );
}
