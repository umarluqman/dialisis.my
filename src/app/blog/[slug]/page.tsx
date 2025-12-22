import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { generateArticleJsonLd } from "@/lib/json-ld";
import { MdxContent } from "./mdx-content";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = allPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | Dialisis.my`,
    description: post.description,
    authors: [{ name: post.author || "Dialisis MY" }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: "Dialisis MY",
      locale: post.locale === "en" ? "en_MY" : "ms_MY",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author || "Dialisis MY"],
      images: [
        {
          url: post.image || `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image || `${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(
    locale === "en" ? "en-MY" : "ms-MY",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

export default function BlogPostPage({ params }: Props) {
  const post = allPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";
  const jsonLd = generateArticleJsonLd(post, baseUrl);
  const locale = post.locale || "ms";
  const isEnglish = locale === "en";

  return (
    <main className="container max-w-3xl py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          {isEnglish ? "Home" : "Utama"}
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-foreground">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">
          {post.title}
        </span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span>{post.readingTime} min</span>
            {post.author && (
              <span>
                {isEnglish ? "by" : "oleh"} {post.author}
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-muted px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MdxContent code={post.body.code} />
        </div>
      </article>

      <div className="mt-12 pt-6 border-t">
        <Link
          href="/blog"
          className="text-primary hover:underline inline-flex items-center gap-2"
        >
          ← {isEnglish ? "Back to Blog" : "Kembali ke Blog"}
        </Link>
      </div>
    </main>
  );
}
