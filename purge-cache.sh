#!/bin/bash

# Vercel Cache Purge Script
# This script helps clear Vercel's edge cache

echo "🚀 Vercel Cache Purge Helper"
echo "=============================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Install it with: npm i -g vercel"
    echo ""
    echo "Alternatively, you can:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Navigate to your project"
    echo "3. Go to Settings > General"
    echo "4. Click 'Purge Everything' under Edge Network"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""
echo "Choose an option:"
echo "1. Purge all cache (recommended)"
echo "2. Redeploy (forces fresh deployment)"
echo "3. Both (purge + redeploy)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Purging Vercel cache..."
        vercel cache purge --yes
        ;;
    2)
        echo ""
        echo "🚀 Redeploying..."
        vercel --prod --yes
        ;;
    3)
        echo ""
        echo "🔄 Purging cache..."
        vercel cache purge --yes
        echo ""
        echo "🚀 Redeploying..."
        vercel --prod --yes
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done! Your cache has been cleared."
echo ""
echo "📱 For Safari on iPhone, also try:"
echo "   - Close Safari completely (swipe up and close)"
echo "   - Clear Safari cache: Settings > Safari > Clear History and Website Data"
echo "   - Hard refresh: Hold refresh button and tap 'Reload Without Content Blockers'"

