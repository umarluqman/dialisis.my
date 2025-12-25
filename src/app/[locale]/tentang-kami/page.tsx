import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.metadata");
  const locale = await getLocale();
  const ogLocale = locale === "ms" ? "ms_MY" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://dialisis.my/tentang-kami",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://dialisis.my/tentang-kami",
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

export default function TentangKamiPage() {
  const t = useTranslations("about.content");

  const offerings = [
    t("offerings.directory"),
    t("offerings.details"),
    t("offerings.search"),
    t("offerings.guide"),
  ];

  const commitments = [
    t("commitments.accurate"),
    t("commitments.informed"),
    t("commitments.access"),
    t("commitments.support"),
  ];

  return (
    <main className="container max-w-4xl py-6 space-y-8 mb-20">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("missionTitle")}</h2>
          <p className="text-muted-foreground">{t("missionDescription")}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("offeringsTitle")}</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {offerings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("commitmentTitle")}</h2>
          <p className="text-muted-foreground">{t("commitmentIntro")}</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {commitments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
