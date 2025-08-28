"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  centerName?: string;
  phoneNumber?: string;
  town?: string;
}

export function FAQSection({ centerName, phoneNumber, town }: FAQSectionProps) {
  // Dynamic FAQ items based on center details
  const faqItems: FAQItem[] = [
    {
      question: "Apakah jenis rawatan dialisis yang disediakan?",
      answer: `${centerName || "Pusat kami"} menyediakan perkhidmatan hemodialisis (HD) berkualiti tinggi dengan menggunakan peralatan moden dan teknologi terkini. Kami juga menawarkan rawatan untuk pesakit Hepatitis B dan C di ruang khas yang berasingan untuk memastikan keselamatan semua pesakit.`,
    },
    {
      question: "Berapa kos rawatan dialisis di pusat ini?",
      answer: "Kos rawatan bergantung kepada jenis rawatan dan keperluan pesakit. Kami menerima pembayaran melalui panel insurans, SOCSO, dan pembayaran sendiri. Sila hubungi kami untuk maklumat terperinci mengenai pakej rawatan dan kaedah pembayaran yang tersedia.",
    },
    {
      question: "Bagaimana untuk membuat temujanji rawatan?",
      answer: `Untuk membuat temujanji, anda boleh menghubungi kami di ${phoneNumber || "nombor telefon kami"} atau datang terus ke pusat kami. Pasukan kami akan membantu mengatur jadual rawatan yang sesuai dengan keperluan anda. Kami juga menerima pesakit tumpang sementara dengan perjanjian terlebih dahulu.`,
    },
    {
      question: "Apakah waktu operasi pusat dialisis ini?",
      answer: "Pusat kami beroperasi dari Isnin hingga Sabtu dengan tiga sesi harian: Sesi Pagi (7:00 pagi - 12:00 tengahari), Sesi Tengahari (12:30 - 5:30 petang), dan Sesi Malam (6:00 - 11:00 malam). Kami tutup pada hari Ahad dan cuti umum.",
    },
    {
      question: "Adakah pusat ini menerima pesakit baru?",
      answer: `Ya, ${centerName || "pusat kami"} menerima pesakit baru. Pesakit perlu membawa surat rujukan dari doktor, laporan perubatan terkini, dan dokumen berkaitan. Kami akan menjalankan penilaian awal sebelum memulakan rawatan.`,
    },
    {
      question: "Apakah kemudahan yang disediakan untuk pesakit?",
      answer: `Kami menyediakan ruang rawatan yang selesa dengan penghawa dingin, katil yang boleh dilaras, TV untuk hiburan, dan makanan ringan. Terdapat juga kemudahan parkir yang mencukupi untuk pesakit dan pelawat di ${town || "lokasi kami"}.`,
    },
    {
      question: "Bolehkah keluarga menemani semasa rawatan?",
      answer: "Ya, ahli keluarga dibenarkan menemani pesakit semasa rawatan. Kami menyediakan kerusi untuk peneman di sebelah setiap katil rawatan. Namun, bilangan peneman mungkin dihadkan untuk memastikan keselesaan semua pesakit.",
    },
    {
      question: "Adakah pusat ini mempunyai doktor pakar?",
      answer: "Pusat kami mempunyai doktor bertugas yang berpengalaman dan pakar nefrologi panel yang membuat lawatan berkala. Pasukan perubatan kami terlatih untuk mengendalikan pelbagai situasi dan memberikan penjagaan terbaik kepada pesakit.",
    },
    {
      question: "Apakah langkah keselamatan COVID-19 yang diambil?",
      answer: "Kami mengamalkan SOP ketat termasuk pemeriksaan suhu, pemakaian pelitup muka, penjarakan sosial, dan sanitasi berkala. Pesakit yang bergejala akan dirujuk untuk ujian COVID-19 sebelum rawatan dibenarkan.",
    },
    {
      question: "Bagaimana untuk mendapatkan bantuan kewangan untuk rawatan?",
      answer: "Terdapat beberapa pilihan bantuan kewangan termasuk Skim Bantuan Dialisis Kerajaan, bantuan Zakat, SOCSO, dan NGO. Pasukan kami boleh membantu anda memohon bantuan yang sesuai. Sila bawa dokumen sokongan untuk proses permohonan.",
    },
  ];

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Soalan Lazim (FAQ)</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="text-base font-medium pr-4">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
        <h3 className="font-semibold text-lg mb-2">Ada soalan lain?</h3>
        <p className="text-muted-foreground mb-4">
          Jika anda mempunyai soalan lain atau memerlukan maklumat lanjut, jangan teragak-agak untuk menghubungi kami.
        </p>
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Hubungi kami di {phoneNumber}
          </a>
        )}
      </div>
    </div>
  );
}