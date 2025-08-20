#!/usr/bin/env node
/*
 *  Copyright 2025 Adobe All Rights Reserved.
 *  NOTICE:  All information contained herein is, and remains the property of Adobe and its suppliers, if any.
 *  The intellectual and technical concepts contained herein are proprietary to Adobe and its suppliers and are protected by all applicable intellectual property laws, including trade secret and copyright laws.
 *  Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained from Adobe.
 */

const { spawn } = require('child_process');
const { cleanupTempFile, tempConfigPath } = require('./generate-spectaql-config');

// Get command line arguments (everything after the script name)
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/run-spectaql-with-cleanup.js <spectaql-command>');
  console.error('Example: node scripts/run-spectaql-with-cleanup.js --target-file index.html --config spectaql/config-merchandising-temp.yml');
  process.exit(1);
}

// First, generate the config file
console.log('Generating SpectaQL configuration...');
const generateConfig = require('./generate-spectaql-config');

// Now run SpectaQL with the provided arguments
console.log('Running SpectaQL...');
const spectaqlProcess = spawn('spectaql', args, {
  stdio: 'inherit',
  shell: true
});

// Handle process events
spectaqlProcess.on('close', (code) => {
  console.log(`SpectaQL process exited with code ${code}`);
  
  // Clean up the temporary file
  cleanupTempFile();
  
  // Exit with the same code as SpectaQL
  process.exit(code);
});

spectaqlProcess.on('error', (error) => {
  console.error('Failed to start SpectaQL:', error);
  cleanupTempFile();
  process.exit(1);
});

// Handle interrupt signals
process.on('SIGINT', () => {
  spectaqlProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  spectaqlProcess.kill('SIGTERM');
});
