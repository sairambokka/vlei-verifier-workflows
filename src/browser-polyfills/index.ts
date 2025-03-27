/**
 * Entry point for browser polyfills
 * This module exports all the browser-compatible replacements for Node.js modules
 */

import fs from './fs.js';
import path from './path.js';
import process from './process.js';
import {
  getDirname,
  getFilename,
  isBrowser,
  loadResource,
  virtualFileSystem,
  resourceUrls,
  addVirtualFile,
} from './globals.js';

// Export all browser polyfills
export {
  fs,
  path,
  process,
  getDirname,
  getFilename,
  isBrowser,
  loadResource,
  virtualFileSystem,
  resourceUrls,
  addVirtualFile,
};

// Helper function to initialize the browser environment
export async function initBrowserEnvironment(): Promise<void> {
  if (!isBrowser()) {
    // Not running in a browser, so no initialization needed
    return;
  }

  // Pre-load essential resources
  try {
    // We might want to pre-load workflow and config files here
    console.log('Initialized browser environment for vlei-verifier-workflows');
  } catch (error) {
    console.error('Failed to initialize browser environment:', error);
    throw error;
  }
}

// Default export for convenience
export default {
  fs,
  path,
  process,
  getDirname,
  getFilename,
  isBrowser,
  loadResource,
  virtualFileSystem,
  resourceUrls,
  addVirtualFile,
  initBrowserEnvironment,
};
