import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy.metadata");
  const locale = await getLocale();
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://dialisis.my/polisi-privasi",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://dialisis.my/polisi-privasi",
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

export default async function PrivacyPage() {
  const t = useTranslations("privacy.content");
  const locale = await getLocale();
  const formattedDate = new Intl.DateTimeFormat(
    locale === "ms" ? "ms-MY" : "en-US"
  ).format(new Date());

  const collectionItems = [
    t("sections.collection.items.form"),
    t("sections.collection.items.email"),
    t("sections.collection.items.usage"),
  ];

  const usageItems = [
    t("sections.usage.items.info"),
    t("sections.usage.items.respond"),
    t("sections.usage.items.improve"),
    t("sections.usage.items.updates"),
  ];

  const userRights = [
    t("sections.rights.items.access"),
    t("sections.rights.items.correct"),
    t("sections.rights.items.delete"),
    t("sections.rights.items.object"),
  ];

  return (
    <main className="container py-8 md:py-12">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <section className="mb-8">
          <p className="text-gray-600 mb-8">
            {t("updated", { date: formattedDate })}
          </p>

          <p>{t("intro")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.collection.title")}
          </h2>
          <p>{t("sections.collection.description")}</p>
          <ul className="list-disc pl-6 mt-2">
            {collectionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.usage.title")}
          </h2>
          <p>{t("sections.usage.description")}</p>
          <ul className="list-disc pl-6 mt-2">
            {usageItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.protection.title")}
          </h2>
          <p>{t("sections.protection.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.sharing.title")}
          </h2>
          <p>{t("sections.sharing.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.cookies.title")}
          </h2>
          <p>{t("sections.cookies.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.rights.title")}
          </h2>
          <p>{t("sections.rights.description")}</p>
          <ul className="list-disc pl-6 mt-2">
            {userRights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.changes.title")}
          </h2>
          <p>{t("sections.changes.description")}</p>
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
