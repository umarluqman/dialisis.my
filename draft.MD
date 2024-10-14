Pages

- url: / - homepage
  - listing for all dialysis centers
  - search bar
  - filter by state
  - filter by district
  - filter by type of dialysis center
  - sort by
  - pagination
  - view details
- url: /[state] - dialysis center based on state
  -same like homepage
- url: /[state]/[district] - dialysis center based on district
  - same like hompage
- url: /[state]/[district]/[dialysis-center] - dialysis center details page

  - name
  - address
  - phone number
  - email
  - website

  file structure:
  ├── README.md
  ├── TODO.md
  ├── components.json
  ├── contentlayer.config.js
  ├── data
  | ├── johor.csv
  | ├── json
  | | ├── johor.json
  | | ├── kedah.json
  | | ├── kelantan.json
  | | ├── labuan.json
  | | ├── melaka.json
  | | ├── negeri-sembilan.json
  | | ├── pahang.json
  | | ├── perak.json
  | | ├── perlis.json
  | | ├── pulau-pinang.json
  | | ├── putrajaya.json
  | | ├── sabah.json
  | | ├── sarawak.json
  | | ├── selangor.json
  | | └── terengganu.json
  | ├── kedah.csv
  | ├── kelantan.csv
  | ├── labuan.csv
  | ├── melaka.csv
  | ├── negeri-sembilan.csv
  | ├── pahang.csv
  | ├── perak.csv
  | ├── perlis.csv
  | ├── pulau-pinang.csv
  | ├── putrajaya.csv
  | ├── sabah.csv
  | ├── sarawak.csv
  | ├── selangor.csv
  | └── terengganu.csv
  ├── data.json
  ├── docker-compose.yml
  ├── draft.MD
  ├── e2e
  | └── example.spec.ts
  ├── next-env.d.ts
  ├── next-sitemap.config.js
  ├── next.config.js
  ├── package-lock.json
  ├── package.json
  ├── playwright.config.ts
  ├── pnpm-lock.yaml
  ├── postcss.config.cjs
  ├── posts
  | └── post-01.md
  ├── prisma
  | ├── migrations
  | | ├── 20240918032345_init
  | | | └── migration.sql
  | | └── migration_lock.toml
  | └── schema.prisma
  ├── public
  | ├── image-404.png
  | ├── js
  | | └── script.js
  | ├── next.svg
  | ├── robots.txt
  | ├── sitemap-0.xml
  | ├── sitemap.xml
  | ├── thirteen.svg
  | └── vercel.svg
  ├── src
  | ├── app
  | | ├── (site)
  | | | ├── favicon.ico
  | | | └── page.tsx
  | | ├── [state]
  | | | ├── [district]
  | | | └── page.tsx
  | | ├── blog
  | | | ├── [slug]
  | | | └── page.tsx
  | | ├── globals.css
  | | ├── layout.tsx
  | | ├── server-sitemap-index.xml
  | | | └── route.ts
  | | └── server-sitemaps
  | | ├── [index]
  | | └── route.ts
  | ├── components
  | | ├── Analytics.tsx
  | | ├── CookieBanner.tsx
  | | ├── TryImage.tsx
  | | └── ui
  | | ├── button.tsx
  | | ├── card.tsx
  | | ├── checkbox.tsx
  | | ├── command.tsx
  | | ├── dialog.tsx
  | | ├── dropdown-menu.tsx
  | | ├── input.tsx
  | | ├── popover.tsx
  | | └── select.tsx
  | ├── lib
  | | ├── db.ts
  | | ├── sitemap.ts
  | | └── utils.ts
  | └── serverless
  | └── example.ts
  ├── tailwind.config.ts
  └── tsconfig.json
