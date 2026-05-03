import path from 'node:path'
import { defineConfig, env } from 'prisma/config'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '.env.local') })

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url: 'file:./prisma/dev.db',
  },
})
