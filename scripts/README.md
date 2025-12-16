# Database Scripts Documentation

This directory contains utility scripts for managing and querying the dialysis centers database.

## 📋 Available Scripts

### 1. `slug-to-id.js` - Slug to Center ID Converter

A utility script to convert dialysis center slugs to their corresponding database IDs and vice versa.

#### 🚀 Quick Start

```bash
# Find center ID by slug
node scripts/slug-to-id.js "pusat-hemodialisis-as-salam-cawangan-tanah-merah"

# List all centers with their slugs and IDs
node scripts/slug-to-id.js --list
```

#### 📖 Usage Examples

**Find a specific center ID:**
```bash
node scripts/slug-to-id.js "pusat-hemodialisis-as-salam-cawangan-tanah-merah"
```

**Output:**
```
🔍 Looking for center with slug: pusat-hemodialisis-as-salam-cawangan-tanah-merah
✅ Found center:
ID: cmcif6ham0001u66hs1c9hzxe
Slug: pusat-hemodialisis-as-salam-cawangan-tanah-merah
Name: Pusat Hemodialisis As-Salam Cawangan Tanah Merah
Title: Pusat Hemodialisis As-Salam Cawangan Tanah Merah
```

**List all centers:**
```bash
node scripts/slug-to-id.js --list
```

**Output:**
```
📋 All centers with their slugs:
================================================================================
1. Pusat Dialisis Hospital Sultanah Bahiyah
   ID: cmcif6ham0001u66hs1c9hzxe
   Slug: pusat-dialisis-hospital-sultanah-bahiyah

2. Pusat Hemodialisis As-Salam Cawangan Tanah Merah
   ID: cmcif6ham0002u66hs1c9hzxe
   Slug: pusat-hemodialisis-as-salam-cawangan-tanah-merah

...
```

#### 🔧 Prerequisites

1. **Environment Variables**: Ensure your `.env` file contains:
   ```env
   TURSO_DATABASE_URL=libsql://your-database-url
   TURSO_AUTH_TOKEN=your-auth-token
   ```

2. **Dependencies**: Make sure you have the required packages installed:
   ```bash
   pnpm install @prisma/client @libsql/client @prisma/adapter-libsql dotenv
   ```

3. **Database Connection**: Ensure your Turso database is accessible and the schema is up to date.

#### ⚙️ Script Functions

##### `slugToId(slug)`
- **Purpose**: Converts a slug to a center ID
- **Parameters**: `slug` (string) - The center's slug
- **Returns**: Center ID (string) or null if not found
- **Output**: Displays center details in console

##### `listAllSlugs()`
- **Purpose**: Lists all centers with their slugs and IDs
- **Returns**: Array of center objects
- **Output**: Displays formatted list in console

#### 🛠️ Error Handling

The script includes comprehensive error handling:
- Database connection errors
- Missing environment variables
- Invalid slugs
- Network connectivity issues

#### 💡 Common Use Cases

1. **API Development**: Get center IDs for API endpoints
2. **Data Migration**: Map slugs to IDs during data transfers
3. **Debugging**: Verify slug-to-ID mappings
4. **Content Management**: Find centers by their URL-friendly names

#### 📊 Database Schema Reference

The script queries the `DialysisCenter` table with the following structure:
```sql
DialysisCenter {
  id: String (Primary Key)
  slug: String (Unique)
  dialysisCenterName: String
  title: String
  -- ... other fields
}
```

#### 🚨 Troubleshooting

**Error: "No center found with slug"**
- Verify the slug exists in the database
- Check for typos in the slug
- Ensure the database is properly connected

**Error: "Database connection failed"**
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set
- Check network connectivity
- Ensure Turso database is active

**Error: "Prisma client not found"**
- Run `pnpm prisma generate` to generate the client
- Ensure all dependencies are installed

#### 🔄 Integration with Other Scripts

This script can be used in conjunction with other scripts in this directory:
- `add-dialysis-center.js` - Add new centers
- `update-center.js` - Update existing centers
- `verify-center.js` - Verify center data

#### 📈 Performance Notes

- The script uses Prisma's optimized queries
- Results are ordered alphabetically for better readability
- Database connections are properly closed after execution

#### 🤝 Contributing

When adding new functionality to this script:
1. Follow the existing code structure
2. Add proper error handling
3. Update this documentation
4. Test with various input scenarios

---

## 📚 Related Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Turso Documentation](https://docs.tur.so)
- [LibSQL Documentation](https://github.com/libsql/libsql)

## 🆘 Support

For issues with these scripts:
1. Check the troubleshooting section above
2. Verify your environment variables
3. Ensure database connectivity
4. Review the error messages for specific guidance
