#!/usr/bin/env bash
set -e

echo "⚠️  WARNING: This will DELETE ALL PRODUCTION DATA!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo ""
echo "Dropping all tables and migration history..."

# Drop tables one by one (multi-line commands don't work well with wrangler)
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS saved_routes;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS photos;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS line_users;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS routes;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS users;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS d1_migrations;"
npx wrangler d1 execute roadar-db --remote --command="DROP TABLE IF EXISTS _cf_KV;"

echo ""
echo "Applying migrations..."
npm run migrate:production

echo ""
echo "✅ Production database reset complete!"

