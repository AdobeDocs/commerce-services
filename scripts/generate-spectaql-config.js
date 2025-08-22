#!/usr/bin/env node
/*
 *  Copyright 2025 Adobe All Rights Reserved.
 *  NOTICE:  All information contained herein is, and remains the property of Adobe and its suppliers, if any.
 *  The intellectual and technical concepts contained herein are proprietary to Adobe and its suppliers and are protected by all applicable intellectual property laws, including trade secret and copyright laws.
 *  Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained from Adobe.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Read the base configuration
const configPath = path.join(__dirname, '../spectaql/config-merchandising.yml');
const configContent = fs.readFileSync(configPath, 'utf8');

// Get TENANT_ID from environment variable (from .env file or system)
const tenantId = process.env.TENANT_ID;
if (!tenantId) {
  console.error('Error: TENANT_ID environment variable is required');
  console.error('');
  console.error('You can set it in several ways:');
  console.error('1. Create a .env file in the project root with: TENANT_ID=your_tenant_id');
  console.error('2. Set it as a system environment variable: export TENANT_ID=your_tenant_id');
  console.error('3. Set it inline: TENANT_ID=your_tenant_id node scripts/generate-spectaql-config.js');
  console.error('');
  console.error('Example .env file:');
  console.error('  TENANT_ID=abc123');
  console.error('  # API_KEY=your_api_key_here');
  process.exit(1);
}

// Replace the placeholder with the actual tenant ID
const updatedConfig = configContent.replace(/\${TENANT_ID}/g, tenantId);

// Write the updated configuration to a temporary file
const tempConfigPath = path.join(__dirname, '../spectaql/config-merchandising-temp.yml');
fs.writeFileSync(tempConfigPath, updatedConfig);

console.log(`Generated SpectaQL config for tenant: ${tenantId}`);
console.log(`Temporary config file: ${tempConfigPath}`);
console.log('Use this file with: spectaql --config spectaql/config-merchandising-temp.yml');

// Function to clean up temporary file
function cleanupTempFile() {
  try {
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
      console.log('Cleaned up temporary config file');
    }
  } catch (error) {
    console.warn('Warning: Could not clean up temporary file:', error.message);
  }
}

// Clean up on script exit
process.on('exit', cleanupTempFile);
process.on('SIGINT', () => {
  cleanupTempFile();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanupTempFile();
  process.exit(0);
});

// Export the cleanup function for use by other scripts
module.exports = { cleanupTempFile, tempConfigPath };
