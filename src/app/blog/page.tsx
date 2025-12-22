import { allPosts, Post } from "contentlayer/generated";
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";
import { generateBlogListJsonLd } from "@/lib/json-ld";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  searchParams: { locale?: string };
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const locale = searchParams.locale || "ms";
  const isEnglish = locale === "en";

  return baseGenerateMetadata({
    title: "Blog",
    description: isEnglish
      ? "Articles about dialysis, kidney health, and healthcare in Malaysia"
      : "Artikel tentang dialisis, kesihatan buah pinggang, dan penjagaan kesihatan di Malaysia",
    canonicalUrl: "https://dialisis.my/blog",
  });
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

function BlogCard({ post, locale }: { post: Post; locale: string }) {
  return (
    <article className="border rounded-lg p-6 hover:border-primary transition-colors">
      <Link href={post.url}>
        <h3 className="text-xl font-semibold mb-2 hover:text-primary">
          {post.title}
        </h3>
      </Link>
      <p className="text-muted-foreground mb-3">{post.description}</p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <span>{post.readingTime} min</span>
        {post.category && (
          <span className="bg-muted px-2 py-0.5 rounded">{post.category}</span>
        )}
      </div>
    </article>
  );
}

export default function BlogPage({ searchParams }: Props) {
  const locale = searchParams.locale || "ms";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dialisis.my";

  const posts = allPosts
    .filter((post) => (post.locale || "ms") === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  const jsonLd = generateBlogListJsonLd(baseUrl, locale);
  const isEnglish = locale === "en";

  return (
    <main className="container max-w-4xl py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          {isEnglish
            ? "Articles about dialysis and kidney health"
            : "Artikel tentang dialisis dan kesihatan buah pinggang"}
        </p>

        <div className="flex gap-2 mt-4">
          <Link
            href="/blog?locale=ms"
            className={`px-3 py-1 rounded text-sm ${
              locale === "ms"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Bahasa Melayu
          </Link>
          <Link
            href="/blog?locale=en"
            className={`px-3 py-1 rounded text-sm ${
              locale === "en"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            English
          </Link>
        </div>
      </header>

      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            {isEnglish ? "Featured" : "Pilihan"}
          </h2>
          <div className="grid gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">
          {isEnglish ? "All Articles" : "Semua Artikel"}
        </h2>
        <div className="grid gap-6">
          {regularPosts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-muted-foreground py-8 text-center">
            {isEnglish ? "No articles yet." : "Tiada artikel lagi."}
          </p>
        )}
      </section>
    </main>
  );
}
