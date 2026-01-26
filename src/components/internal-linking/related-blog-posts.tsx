import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedBlogPosts } from "@/lib/internal-linking-queries";

interface RelatedBlogPostsProps {
  treatmentTypes: string[];
  locale?: "ms" | "en";
  limit?: number;
  excludeSlug?: string;
  title?: string;
}

export function RelatedBlogPosts({
  treatmentTypes,
  locale = "ms",
  limit = 3,
  excludeSlug,
  title,
}: RelatedBlogPostsProps) {
  const posts = getRelatedBlogPosts({
    treatmentTypes,
    locale,
    limit,
    excludeSlug,
  });

  if (posts.length === 0) return null;

  const sectionTitle =
    title ||
    (locale === "en"
      ? "Learn More About Dialysis"
      : "Ketahui Lebih Lanjut Tentang Dialisis");

  return (
    <section className="mt-8 pt-6 border-t">
      <h2 className="text-lg font-semibold mb-4">{sectionTitle}</h2>
      <div className="grid gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-medium text-foreground line-clamp-1">
                {post.title}
              </span>
              <span className="text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
