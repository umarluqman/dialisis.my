import { prisma } from "@/lib/db";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
  children: React.ReactNode;
}

// Reuse the getCenter function from page.tsx
async function getCenter(slug: string) {
  const center = await prisma.dialysisCenter.findUnique({
    where: { slug },
    include: {
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) return null;

  return {
    ...center,
    state: {
      ...center.state,
      name: center.state.name.replace(/-/g, " "),
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const center = await getCenter(params.slug);

  if (!center) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }

  const title = `${center.dialysisCenterName} - Pusat Dialisis di ${center.state.name}`;
  const description = `Dapatkan maklumat lengkap tentang ${center.title} di ${center.town}, ${center.state.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/center/${params.slug}`,
      siteName: "Cari Pusat Dialisis Malaysia",
      locale: "ms_MY",
      type: "article",
      images: [
        {
          // We'll generate this URL dynamically
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og/${params.slug}`,
          width: 1200,
          height: 630,
          alt: center.dialysisCenterName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${process.env.NEXT_PUBLIC_APP_URL}/api/og/${params.slug}`],
    },
  };
}

export default function DialysisCenterLayout({ children }: Props) {
  return children;
}
