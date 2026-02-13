#!/usr/bin/env bash
set -e

echo "⚠️  WARNING: This will DELETE ALL PRODUCTION DATA!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo ""
echo "Dropping all tables and migration history..."

# Drop tables in reverse dependency order (child tables first)
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS regions;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS prefectures;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS trip_likes;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS trip_photos;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS trips;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS saved_routes;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS photos;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS routes;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS line_users;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS users;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS d1_migrations;"

echo ""
echo "Applying migrations..."
npm run migrate:production

echo ""
echo "✅ Production database reset complete!"

