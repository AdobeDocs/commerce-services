#!/usr/bin/env node

/**
 * Enhanced build script for merchandising API documentation
 * This script runs the standard SpectaQL build and then injects enhanced tier pricing descriptions
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building Merchandising API Documentation with Enhanced Descriptions\n');

try {
  // Step 1: Run the standard merchandising API build
  console.log('📋 Step 1: Generating base documentation with SpectaQL...');
  execSync('npm run build:merchandising-api', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Base documentation generated successfully\n');

  // Step 2: Inject enhanced descriptions
  console.log('📋 Step 2: Injecting enhanced tier pricing descriptions...');
  execSync('node scripts/inject-tier-pricing-descriptions.js', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('\n🎉 Merchandising API documentation with enhanced descriptions completed successfully!');
  console.log('📄 Generated file: static/graphql-api/merchandising-api/index.html');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}



