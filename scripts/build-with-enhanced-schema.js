#!/usr/bin/env node
/*
 *  Copyright 2025 Adobe All Rights Reserved.
 *  NOTICE:  All information contained herein is, and remains the property of Adobe and its suppliers, if any.
 *  The intellectual and technical concepts contained herein are proprietary to Adobe and its suppliers and are protected by all applicable intellectual property laws, including trade secret and copyright laws.
 *  Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained from Adobe.
 */

const { spawn } = require('child_process');
const { main: enhanceSchema } = require('./fetch-and-enhance-schema');
const { cleanupTempFile } = require('./generate-spectaql-config');

/**
 * Build documentation with enhanced schema
 */
async function buildWithEnhancedSchema() {
  try {
    // Step 1: Generate enhanced schema with injected descriptions
    console.log('🚀 Step 1: Generating enhanced schema...');
    await enhanceSchema();
    
    // Step 2: Generate SpectaQL config pointing to the enhanced schema
    console.log('🚀 Step 2: Generating SpectaQL configuration...');
    const fs = require('fs');
    const { tempConfigPath, writeTempMerchandisingConfig } = require('./generate-spectaql-config');
    writeTempMerchandisingConfig();
    let tempConfig = fs.readFileSync(tempConfigPath, 'utf8');
    tempConfig = tempConfig.replace(
      /^(\s*)#(introspectionFile:\s*spectaql\/enhanced-schema\.json)/m,
      '$1$2'
    );
    tempConfig = tempConfig.replace(
      /^(\s*)(url:\s*https:\/\/.*\/graphql.*)/m,
      '$1#$2'
    );
    fs.writeFileSync(tempConfigPath, tempConfig);
    console.log('📝 Configured SpectaQL to use enhanced schema file');
    
    // Step 3: Run SpectaQL with enhanced schema
    console.log('🚀 Step 3: Running SpectaQL with enhanced schema...');
    
    // Get command line arguments (everything after the script name)
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      args.push('--target-file', 'index.html', '--config', 'spectaql/config-merchandising-temp.yml');
    }
    
    const spectaqlProcess = spawn('spectaql', args, {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process events
    spectaqlProcess.on('close', (code) => {
      console.log(`SpectaQL process exited with code ${code}`);
      
      // Clean up the temporary file
      cleanupTempFile();
      
      if (code === 0) {
        console.log('🎉 Documentation build completed successfully with enhanced descriptions!');
      }
      
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
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildWithEnhancedSchema();
