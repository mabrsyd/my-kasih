#!/bin/bash

# ============================================
# MY KASIH CMS - DATABASE FIX QUICK START
# ============================================
# Run this to validate setup

set -e

echo "=================================="
echo "Database Configuration Validator"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ ERROR: .env.local file not found!"
    echo "   Solution: Create .env.local and add DATABASE_URL and DIRECT_URL"
    exit 1
fi

echo "✓ .env.local file found"
echo ""

# Extract variables
DB_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2 | tr -d '"')
DIR_URL=$(grep "^DIRECT_URL=" .env.local | cut -d'=' -f2 | tr -d '"')

echo "Checking DATABASE_URL:"
if [[ $DB_URL == *"pooler.supabase.com"* ]] && [[ $DB_URL == *"6543"* ]]; then
    echo "  ✓ Correct pooler endpoint"
else
    echo "  ❌ Invalid pooler endpoint. Should have: pooler.supabase.com:6543"
fi

echo ""
echo "Checking DIRECT_URL:"
if [[ $DIR_URL == *"postgres.supabase.co"* ]] && [[ $DIR_URL == *"5432"* ]]; then
    echo "  ✓ Correct direct endpoint"
else
    echo "  ❌ Invalid direct endpoint. Should have: postgres.supabase.co:5432 (NOT pooler!)"
fi

echo ""
echo "=================================="
echo "Summary:"
echo "  If both show ✓ = Configuration CORRECT"
echo "  If any show ❌ = Update credentials in .env.local"
echo "=================================="
