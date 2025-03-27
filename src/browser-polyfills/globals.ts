/**
 * Browser-compatible alternatives for Node.js global variables
 * Provides replacements for __dirname and __filename in browser environments
 */

/**
 * Virtual directory map to simulate the project's file structure in the browser
 * This allows us to map virtual paths to resource URLs for loading workflows and configs
 */
export const virtualFileSystem = {
  // Base project paths
  '/': '/',
  '/src': '/src',
  '/src/workflows': '/src/workflows',
  '/src/config': '/src/config',

  // Workflow files
  '/src/workflows/singlesig-single-user-light.yaml':
    '/src/workflows/singlesig-single-user-light.yaml',
  '/src/workflows/singlesig-single-user.yaml':
    '/src/workflows/singlesig-single-user.yaml',

  // Configuration files
  '/src/config/configuration-singlesig-single-user-light.json':
    '/src/config/configuration-singlesig-single-user-light.json',
  '/src/config/configuration-singlesig-single-user.json':
    '/src/config/configuration-singlesig-single-user.json',
};

/**
 * Resource URLs for loading workflow/config files in browser
 * Maps file paths to URLs where the content can be fetched from
 */
export const resourceUrls: Record<string, string> = {
  // Workflow files (these URLs would point to the bundled/hosted versions of these files)
  '/src/workflows/singlesig-single-user-light.yaml':
    '/resources/workflows/singlesig-single-user-light.yaml',
  '/src/workflows/singlesig-single-user.yaml':
    '/resources/workflows/singlesig-single-user.yaml',

  // Configuration files
  '/src/config/configuration-singlesig-single-user-light.json':
    '/resources/config/configuration-singlesig-single-user-light.json',
  '/src/config/configuration-singlesig-single-user.json':
    '/resources/config/configuration-singlesig-single-user.json',
};

// Virtual module paths - maps from virtual filesystem paths to apparent Node.js module paths
export const modulePaths: Record<string, string> = {
  '/src/utils/workflow-helpers.ts': '../../src/utils/workflow-helpers.js',
  '/src/types/workflow.ts': '../../src/types/workflow.js',
  '/src/utils/generate-test-data.ts': '../../src/utils/generate-test-data.js',
};

/**
 * Get the virtual __dirname for a module in the browser environment
 * @param modulePath The module path as it would appear in Node.js
 * @returns A virtual __dirname value
 */
export function getDirname(modulePath: string): string {
  // Default dirname for when we can't determine a better value
  const defaultDirname = '/src';

  // Look through module paths to find a match
  for (const [virtualPath, moduleName] of Object.entries(modulePaths)) {
    if (modulePath.includes(moduleName)) {
      // Found a match, get the directory portion
      const lastSlash = virtualPath.lastIndexOf('/');
      if (lastSlash >= 0) {
        return virtualPath.substring(0, lastSlash);
      }
    }
  }

  return defaultDirname;
}

/**
 * Get the virtual __filename for a module in the browser environment
 * @param modulePath The module path as it would appear in Node.js
 * @returns A virtual __filename value
 */
export function getFilename(modulePath: string): string {
  // Default filename
  const defaultFilename = '/src/index.js';

  // Look through module paths to find a match
  for (const [virtualPath, moduleName] of Object.entries(modulePaths)) {
    if (modulePath.includes(moduleName)) {
      return virtualPath;
    }
  }

  return defaultFilename;
}

/**
 * Add a file mapping to the virtual file system
 * This allows dynamically extending the virtual filesystem
 * @param virtualPath The virtual path in the browser environment
 * @param resourceUrl The URL to fetch the resource from
 * @param modulePath Optional module path for Node.js module name mapping
 */
export function addVirtualFile(
  virtualPath: string,
  resourceUrl: string,
  modulePath?: string
): void {
  virtualFileSystem[virtualPath] = virtualPath;
  resourceUrls[virtualPath] = resourceUrl;

  if (modulePath) {
    modulePaths[virtualPath] = modulePath;
  }
}

/**
 * Load a resource from the virtual file system
 * @param path The virtual path to load
 * @returns Promise resolving to the file content
 */
export async function loadResource(path: string): Promise<string> {
  const url = resourceUrls[path];
  if (!url) {
    throw new Error(`Resource not found in virtual filesystem: ${path}`);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to load resource ${path} from ${url}: ${response.statusText}`
    );
  }

  return response.text();
}

/**
 * Helper to determine if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
