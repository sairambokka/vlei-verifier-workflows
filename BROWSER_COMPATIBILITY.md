# vlei-verifier-workflows: Browser Compatibility

This document explains how to use the `vlei-verifier-workflows` library in browser environments.

## Overview

The `vlei-verifier-workflows` library now includes browser compatibility, allowing you to run workflows directly in the browser without needing a Node.js environment. This is achieved through browser-compatible polyfills for Node.js built-in modules like `fs`, `path`, and `process`.

## Installation

```bash
npm install @gleif-it/vlei-verifier-workflows
```

## Usage in Browser Environments

When used in a browser environment, the library will automatically use browser-compatible versions of Node.js modules. Here's how to use it:

```javascript
import { WorkflowRunner, initBrowserEnvironment } from '@gleif-it/vlei-verifier-workflows';

// Initialize the browser environment
await initBrowserEnvironment();

// Load a workflow and config
const workflow = await fetch('/resources/workflows/singlesig-single-user-light.yaml')
  .then(response => response.text())
  .then(content => {
    // Preload the workflow for later use
    preloadWorkflow('/src/workflows/singlesig-single-user-light.yaml', content);
    return loadWorkflow('/src/workflows/singlesig-single-user-light.yaml');
  });

const config = await fetch('/resources/config/configuration-singlesig-single-user-light.json')
  .then(response => response.text())
  .then(content => {
    // Preload the config for later use
    preloadConfig('/src/config/configuration-singlesig-single-user-light.json', content);
    return loadConfig('/src/config/configuration-singlesig-single-user-light.json');
  });

// Create a workflow runner
const workflowRunner = new WorkflowRunner(workflow, config);

// Run the workflow
await workflowRunner.runWorkflow();
```

## Browser Polyfills

The library includes the following browser-compatible replacements for Node.js modules:

### fs Module

The `fs` module is replaced with an IndexedDB-based implementation that:
- Stores files and directories in the browser's IndexedDB
- Implements key file operations like `readFile`, `writeFile`, `mkdir`, etc.
- Provides both callback and Promise-based APIs

### path Module

The `path` module is replaced with a pure JavaScript implementation that:
- Works just like Node's path module with `join`, `resolve`, `dirname`, etc.
- Maintains compatibility with path manipulation in workflows

### process Module

The `process` module is simulated with:
- Environment variables stored in localStorage
- Command-line arguments available through URL parameters
- Process events that use browser events as appropriate

## Virtual File System

The browser version includes a virtual file system that:
- Maps virtual paths to resource URLs
- Allows preloading workflows and configurations
- Simulates directory and file structures

## Workflow Loading

Browser-specific workflow loading features:

```javascript
import { 
  preloadWorkflow,
  preloadConfig,
  registerWorkflowUrl,
  registerConfigUrl
} from '@gleif-it/vlei-verifier-workflows';

// Register a URL for a workflow
registerWorkflowUrl(
  '/src/workflows/singlesig-single-user.yaml',
  'https://example.com/resources/workflows/singlesig-single-user.yaml'
);

// Preload a workflow directly
preloadWorkflow(
  '/src/workflows/simple-workflow.yaml',
  'workflow:\n  steps:\n    step1:\n      type: create_client\n      agent_name: browser-agent'
);
```

## Limitations

When using the library in a browser environment, be aware of these limitations:

1. **Synchronous Operations**: Node's synchronous operations (`readFileSync`, etc.) are simulated and not truly synchronous.
2. **File System Access**: No access to the actual file system; relies on pre-loaded content or resources loaded via URLs.
3. **Docker Operations**: Docker-based features are not available in the browser.
4. **Environment Variables**: Environment variables need to be set manually or loaded from localStorage.

## Configuration

For advanced configurations, you can modify:

```javascript
import { 
  process, 
  fs, 
  addVirtualFile, 
  virtualFileSystem 
} from '@gleif-it/vlei-verifier-workflows';

// Set environment variables
process.setEnv('KERIA', 'https://my-keria-instance.example.com/admin');
process.setEnv('KERIA_BOOT', 'https://my-keria-instance.example.com');

// Add additional virtual files
addVirtualFile(
  '/custom/path/config.json',
  'https://example.com/resources/custom-config.json'
);
```

## TypeScript Support

The browser version includes TypeScript type definitions for all browser-compatible replacements.

## Bundling

When using a bundler like Webpack, Rollup, or Vite, the browser field in package.json will automatically map Node.js built-in modules to our browser-compatible versions.

## Example Webpack Configuration

```javascript
module.exports = {
  // ...
  resolve: {
    fallback: {
      "fs": false,  // Let the package's browser field handle this
      "path": false,
      "process": false
    }
  }
};
```

## Browser Support

The browser polyfills require:
- IndexedDB support
- ES2020 features (or polyfills)
- Fetch API 