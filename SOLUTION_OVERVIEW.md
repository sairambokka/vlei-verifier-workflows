# Browser Compatibility Solution for vlei-verifier-workflows

## Problem

The original `vlei-verifier-workflows` library had dependencies on Node.js-specific modules (`fs`, `path`, `process`, etc.) that aren't available in browser environments. This caused errors when trying to use the library in browser applications.

## Solution Overview

We've implemented a comprehensive solution that allows the library to run seamlessly in both Node.js and browser environments. Here's what we did:

1. **Created browser-compatible polyfills** for Node.js built-in modules:
   - `fs`: Using IndexedDB for storage
   - `path`: Pure JavaScript implementation
   - `process`: Using localStorage for environment variables

2. **Added a separate browser entry point** (`src/browser.ts`) that:
   - Re-exports all the core functionality
   - Adds browser-specific utilities and polyfills
   - Provides an initialization function

3. **Used package.json's browser field** to automatically:
   - Replace Node.js modules with browser-compatible versions
   - Use the browser-specific entry point

4. **Implemented a virtual file system** for browser environments:
   - Map virtual paths to resource URLs
   - Preload and cache workflow definitions
   - Support both synchronous and asynchronous APIs

5. **Added TypeScript configurations** for proper browser builds

## Key Files Added/Modified

- **Browser Polyfills**:
  - `src/browser-polyfills/fs.ts`: IndexedDB-based file system implementation
  - `src/browser-polyfills/path.ts`: Browser-compatible path module
  - `src/browser-polyfills/process.ts`: Process environment and events simulation
  - `src/browser-polyfills/globals.ts`: Virtual file system and global variables
  - `src/browser-polyfills/workflow-loader.ts`: Browser-compatible workflow loading
  - `src/browser-polyfills/index.ts`: Entry point for browser polyfills

- **Configuration**:
  - `package.json`: Added browser field and browser build configuration
  - `build/configs/tsconfig.browser.json`: TypeScript configuration for browser build

- **Browser Entry Point**:
  - `src/browser.ts`: Browser-specific entry point with initializer function

- **Documentation**:
  - `BROWSER_COMPATIBILITY.md`: User guide for browser usage
  - `SOLUTION_OVERVIEW.md`: Technical overview of the solution

## How It Works

When the library is imported in a browser environment, the bundler (Webpack, Rollup, etc.) automatically:

1. Uses the `browser` field in package.json to replace Node.js modules with our polyfills
2. Loads the browser-specific entry point
3. When `initBrowserEnvironment()` is called, the library:
   - Initializes the IndexedDB-based file system
   - Sets up the virtual file system
   - Loads any pre-bundled workflow definitions

## Usage in Browser Applications

Users can import and use the library like this:

```javascript
import { 
  WorkflowRunner, 
  initBrowserEnvironment,
  preloadWorkflow 
} from '@gleif-it/vlei-verifier-workflows';

// Initialize the browser environment
await initBrowserEnvironment();

// Optionally preload workflows
preloadWorkflow('/workflows/my-workflow.yaml', workflowYamlContent);

// Use the library as normal
const workflow = await loadWorkflow('/workflows/my-workflow.yaml');
const config = { /* ... */ };
const runner = new WorkflowRunner(workflow, config);
await runner.runWorkflow();
```

## Advantages of This Approach

1. **Minimal code changes required** for existing Node.js users
2. **Easy adoption for browser users** with clear APIs
3. **TypeScript support** for all browser-specific functionality
4. **Automatic module replacement** through package.json's browser field
5. **Clear separation of concerns** between Node.js and browser code

## Limitations

1. **Synchronous operations** are simulated and not truly synchronous
2. **Docker-based features** are not available in browsers
3. **File system operations** are limited to pre-loaded content and IndexedDB storage 