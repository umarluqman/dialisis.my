import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
  order: number;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  // Filter and sort featured FAQs
  const featuredFAQs = faqs
    .filter((faq) => faq.featured)
    .sort((a, b) => a.order - b.order);

  if (featuredFAQs.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 border-t-4 border-t-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-primary">
          Frequently Asked Questions
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Find answers to common questions about dialysis treatment
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {featuredFAQs.map((faq, index) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                <span className="flex items-start gap-3">
                  <span className="text-primary font-semibold mt-0.5">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-base">{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-9 pr-4 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}