import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms.metadata");
  const locale = await getLocale();
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://dialisis.my/terma-dan-syarat",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://dialisis.my/terma-dan-syarat",
      type: "website",
      siteName: "Dialisis.my",
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
  };
}

export default function TermaPage() {
  const t = useTranslations("terms.content");

  return (
    <main className="container py-8 md:py-12">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.intro.title")}
          </h2>
          <p>{t("sections.intro.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.usage.title")}
          </h2>
          <p>{t("sections.usage.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.info.title")}
          </h2>
          <p>{t("sections.info.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.disclaimer.title")}
          </h2>
          <p>{t("sections.disclaimer.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.changes.title")}
          </h2>
          <p>{t("sections.changes.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.law.title")}
          </h2>
          <p>{t("sections.law.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.contact.title")}
          </h2>
          <p>{t("sections.contact.description")}</p>
        </section>
      </div>
    </main>
  );
}
