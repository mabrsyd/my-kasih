#!/usr/bin/env node

/**
 * Database Connection Debugging Script
 * Membantu identify masalah dengan DATABASE_URL dan DIRECT_URL
 */

const fs = require('fs');
const path = require('path');

// Baca .env.local secara manual
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse .env file
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^"(.*)"$/, '$1');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
});

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color + args.join(' ') + colors.reset);
}

log(colors.cyan, '='.repeat(60));
log(colors.cyan, 'DATABASE CONNECTION DEBUGGING');
log(colors.cyan, '='.repeat(60));

// Check environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const DIRECT_URL = process.env.DIRECT_URL;
const NODE_ENV = process.env.NODE_ENV;

log(colors.blue, '\n1. ENVIRONMENT VARIABLES STATE:');
log(colors.yellow, '   NODE_ENV:', NODE_ENV || 'NOT SET (default: development)');
log(DATABASE_URL ? colors.green : colors.red, '   DATABASE_URL:', DATABASE_URL ? '✓ SET' : '✗ MISSING');
log(DIRECT_URL ? colors.green : colors.red, '   DIRECT_URL:', DIRECT_URL ? '✓ SET' : '✗ MISSING');

if (!DATABASE_URL || !DIRECT_URL) {
  log(colors.red, '\n❌ CRITICAL: Missing environment variables!');
  log(colors.yellow, '\nSolusi: Edit .env.local dengan credentials Supabase Anda:');
  console.log(`
DATABASE_URL="postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-ap-southeast-1.postgres.supabase.co:5432/postgres"
  `);
  process.exit(1);
}

// Parse URLs
function parseConnectionUrl(url, label) {
  try {
    const u = new URL(url);
    log(colors.blue, `\n2. PARSING ${label}:`);
    log(colors.green, `   Host: ${u.hostname}`);
    log(colors.green, `   Port: ${u.port}`);
    log(colors.green, `   Database: ${u.pathname.replace('/', '')}`);
    log(colors.green, `   User: ${u.username}`);
    log(colors.green, `   Password: ${u.password ? '***' + u.password.slice(-3) : 'NOT SET'}`);
    
    // Check for pooler
    if (u.hostname.includes('pooler')) {
      log(colors.yellow, `   ⚠️  Pooler endpoint detected: ${u.hostname}`);
    }
  } catch (e) {
    log(colors.red, `   ❌ Invalid URL format: ${e.message}`);
  }
}

parseConnectionUrl(DATABASE_URL, 'DATABASE_URL');
parseConnectionUrl(DIRECT_URL, 'DIRECT_URL');

// Validasi struktur Supabase
log(colors.blue, '\n3. SUPABASE CONFIGURATION CHECK:');

const dbHost = new URL(DATABASE_URL).hostname;
const directHost = new URL(DIRECT_URL).hostname;

const isPooler = dbHost.includes('pooler');
const isDirectEndpoint = directHost.includes('postgres.supabase.co');

log(isPooler ? colors.green : colors.red, 
  `   DATABASE_URL pooler: ${isPooler ? '✓ CORRECT' : '✗ SHOULD be pooler endpoint'}`);
log(isDirectEndpoint ? colors.green : colors.red, 
  `   DIRECT_URL endpoint: ${isDirectEndpoint ? '✓ CORRECT' : '✗ SHOULD be direct endpoint (.postgres.supabase.co)'}`);

if (!isDirectEndpoint && dbHost === directHost) {
  log(colors.red, '\n❌ CRITICAL ERROR: DIRECT_URL menggunakan pooler!');
  log(colors.yellow, '\nUbah DIRECT_URL ke endpoint direct:');
  const projectId = dbHost.match(/aws-[^.]+/)?.[0];
  console.log(`DIRECT_URL="postgresql://postgres.PROJECT_ID:PASSWORD@${projectId}.postgres.supabase.co:5432/postgres"`);
}

log(colors.cyan, '\n' + '='.repeat(60));
log(colors.green, '✓ Run this script setiap kali update env');
log(colors.cyan, '='.repeat(60) + '\n');
