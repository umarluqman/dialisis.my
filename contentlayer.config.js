import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    slug: {
      type: "string",
      description: "URL slug for the post",
      required: true,
    },
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    date: {
      type: "date",
      description: "Publication date",
      required: true,
    },
    description: {
      type: "string",
      description: "Brief description for SEO and previews",
      required: true,
    },
    image: {
      type: "string",
      description: "Featured image URL",
      required: false,
    },
    author: {
      type: "string",
      description: "Author name",
      required: false,
    },
    tags: {
      type: "list",
      of: { type: "string" },
      description: "Post tags for filtering",
      required: false,
    },
    category: {
      type: "string",
      description: "Post category",
      required: false,
    },
    locale: {
      type: "enum",
      options: ["ms", "en"],
      description: "Post language: ms (Malay) or en (English)",
      default: "ms",
      required: false,
    },
    featured: {
      type: "boolean",
      description: "Featured post flag",
      default: false,
      required: false,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post.slug}`,
    },
    readingTime: {
      type: "number",
      resolve: (post) => {
        const wordsPerMinute = 200;
        const wordCount = post.body.raw.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
});
