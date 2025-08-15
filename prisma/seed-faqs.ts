import { prisma } from "../src/lib/db";

async function seedFAQs() {
  const faqs = [
    {
      question: "What is dialysis and when is it needed?",
      answer:
        "Dialysis is a treatment that filters and purifies the blood using a machine when your kidneys can't do their job adequately. It's typically needed when you develop end-stage kidney failure — usually when you lose about 85 to 90 percent of your kidney function and have a GFR of less than 15.",
      featured: true,
      order: 1,
    },
    {
      question: "What are the types of dialysis available?",
      answer:
        "There are two main types of dialysis: Hemodialysis (HD) where blood is filtered through a machine outside your body, and Peritoneal Dialysis (PD) where the lining of your abdomen acts as a filter. The choice depends on your medical condition, lifestyle, and personal preference.",
      featured: true,
      order: 2,
    },
    {
      question: "How often do I need dialysis treatment?",
      answer:
        "For hemodialysis, most patients require treatment 3 times per week, with each session lasting about 4 hours. Peritoneal dialysis is usually done daily. Your nephrologist will determine the best schedule based on your specific needs.",
      featured: true,
      order: 3,
    },
    {
      question: "What should I bring to my dialysis appointment?",
      answer:
        "Bring your insurance card, identification, a list of current medications, something to keep you occupied (book, tablet, etc.), a light snack if permitted, and a blanket as dialysis rooms can be cool. Wear comfortable, loose-fitting clothing with easy access to your access site.",
      featured: true,
      order: 4,
    },
    {
      question: "Are there any dietary restrictions while on dialysis?",
      answer:
        "Yes, most dialysis patients need to follow a special diet that limits fluids, sodium, potassium, and phosphorus. You may also need to increase protein intake. A renal dietitian will create a personalized meal plan based on your specific needs and lab results.",
      featured: true,
      order: 5,
    },
    {
      question: "Can I travel while on dialysis?",
      answer:
        "Yes, you can travel while on dialysis with proper planning. For hemodialysis patients, you'll need to arrange treatment at a dialysis center at your destination. Peritoneal dialysis patients can bring their supplies. Always plan ahead and coordinate with your care team.",
      featured: true,
      order: 6,
    },
    {
      question: "What are the potential side effects of dialysis?",
      answer:
        "Common side effects may include fatigue, low blood pressure, muscle cramps, itchy skin, and sleep problems. Most side effects can be managed with proper treatment adjustments and medications. Always report any concerns to your healthcare team.",
      featured: true,
      order: 7,
    },
    {
      question: "Is kidney transplant an option for dialysis patients?",
      answer:
        "Many dialysis patients are candidates for kidney transplant. Your nephrologist will evaluate your eligibility based on your overall health, age, and other medical conditions. If eligible, you can be placed on a transplant waiting list while continuing dialysis.",
      featured: true,
      order: 8,
    },
    {
      question: "How much does dialysis cost in Malaysia?",
      answer:
        "Dialysis costs vary depending on the type and location. Government hospitals offer subsidized rates for Malaysian citizens. Private centers may charge between RM 150-250 per session for hemodialysis. Various financial assistance programs are available through NGOs and government schemes.",
      featured: false,
      order: 9,
    },
    {
      question: "What insurance coverage is available for dialysis?",
      answer:
        "SOCSO provides coverage for eligible members, and many private insurance plans cover dialysis treatment. Government servants can claim through their medical benefits. Check with your insurance provider or hospital social worker for specific coverage details.",
      featured: false,
      order: 10,
    },
  ];

  console.log("Seeding FAQs...");

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    });
  }

  console.log(`Seeded ${faqs.length} FAQs successfully!`);
}

seedFAQs()
  .catch((e) => {
    console.error("Error seeding FAQs:", e);
    process.exit(1);
  });