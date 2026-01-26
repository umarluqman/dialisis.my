import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "**/*.mdx",
  schema: s
    .object({
      slug: s.string(),
      title: s.string(),
      date: s.isodate(),
      description: s.string(),
      image: s.string().optional(),
      author: s.string().optional(),
      tags: s.array(s.string()).optional(),
      category: s.string().optional(),
      locale: s.enum(["ms", "en"]).default("ms"),
      featured: s.boolean().default(false),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform((data) => {
      const wordsPerMinute = 200;
      const wordCount = data.metadata?.wordCount || 100;
      const readingTime = Math.ceil(wordCount / wordsPerMinute);

      return {
        slug: data.slug,
        title: data.title,
        date: data.date,
        description: data.description,
        image: data.image,
        author: data.author,
        tags: data.tags,
        category: data.category,
        locale: data.locale,
        featured: data.featured,
        body: data.body,
        url: `/blog/${data.slug}`,
        readingTime,
      };
    }),
});

export default defineConfig({
  root: "posts",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    gfm: true,
    removeComments: true,
  },
});
