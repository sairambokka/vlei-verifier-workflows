/**
 * Browser-specific entry point for vlei-verifier-workflows
 * This file exports the core workflow functionality along with browser polyfills
 */

// Re-export all core functionality from the main package
export * from './index.js';

// Export browser polyfills
export * from './browser-polyfills/index.js';

// Export named functions from workflow-loader to avoid conflict
export { 
  preloadWorkflow, 
  preloadConfig, 
  registerWorkflowUrl,
  registerConfigUrl,
  getAvailableWorkflows
} from './browser-polyfills/workflow-loader.js';

// Initialize function for browser environment
export async function initBrowserEnvironment(): Promise<void> {
  try {
    const { initBrowserEnvironment: init } = await import('./browser-polyfills/index.js');
    return init();
  } catch (error) {
    console.error('Failed to initialize browser environment:', error);
    throw error;
  }
} 