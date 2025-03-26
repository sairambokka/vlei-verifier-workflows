/**
 * Browser-compatible implementation of Node.js path module
 * This provides the core functionality needed for the vlei-verifier-workflows library
 */

// Path separator
export const sep = '/';

// Path delimiter (for PATH environment variable-like strings)
export const delimiter = ':';

/**
 * Normalize a path by resolving '..' and '.' segments
 * @param path The path to normalize
 * @returns Normalized path
 */
export function normalize(path: string): string {
  // Handle empty path
  if (!path) return '.';
  
  // Replace backslashes with forward slashes for consistency
  path = path.replace(/\\/g, '/');
  
  // Check if path is absolute
  const isAbsolute = path.charAt(0) === '/';
  
  // Handle multiple consecutive slashes
  path = path.replace(/\/+/g, '/');
  
  // Split the path into segments
  const segments = path.split('/').filter(s => s.length > 0);
  const resultSegments: string[] = [];
  
  // Process each segment
  for (const segment of segments) {
    if (segment === '.') {
      // Ignore '.' segments
      continue;
    } else if (segment === '..') {
      // Go up one level for '..' segments
      if (resultSegments.length > 0 && resultSegments[resultSegments.length - 1] !== '..') {
        resultSegments.pop();
      } else if (!isAbsolute) {
        // In a relative path, keep '..' if we can't resolve further up
        resultSegments.push('..');
      }
    } else {
      // Add normal segment
      resultSegments.push(segment);
    }
  }
  
  // Handle special cases
  if (resultSegments.length === 0) {
    return isAbsolute ? '/' : '.';
  }
  
  // Join segments and preserve absolute path if needed
  let result = resultSegments.join('/');
  if (isAbsolute) {
    result = '/' + result;
  }
  
  return result;
}

/**
 * Join all arguments together and normalize the resulting path
 * @param paths Path segments to join
 * @returns Joined path
 */
export function join(...paths: string[]): string {
  // Filter out empty segments
  const filteredPaths = paths.filter(p => p.length > 0);
  
  if (filteredPaths.length === 0) {
    return '.';
  }
  
  // Join with separator and normalize
  const joined = filteredPaths.join('/');
  return normalize(joined);
}

/**
 * Resolve a sequence of paths or path segments into an absolute path
 * In browser environment, this is relative to a virtual root
 * @param paths Path segments to resolve
 * @returns Resolved absolute path
 */
export function resolve(...paths: string[]): string {
  // In a browser, we can't truly resolve to the filesystem root,
  // so we simulate it with a virtual root
  
  let resolvedPath = '';
  let isAbsolute = false;
  
  // Process paths from right to left
  for (let i = paths.length - 1; i >= 0; i--) {
    const path = paths[i];
    
    // Skip empty paths
    if (!path) continue;
    
    // Join with existing resolved path
    resolvedPath = path + (resolvedPath ? '/' + resolvedPath : '');
    
    // Check if this path is absolute
    if (path.charAt(0) === '/') {
      isAbsolute = true;
      break;
    }
  }
  
  // Normalize the resulting path
  resolvedPath = normalize(resolvedPath);
  
  // If no segment was absolute, prepend the virtual current working directory
  if (!isAbsolute) {
    // In browser, we'll use a virtual CWD of '/'
    resolvedPath = '/' + resolvedPath;
  }
  
  return resolvedPath;
}

/**
 * Return the directory name of a path
 * @param path The path to process
 * @returns The directory part of the path
 */
export function dirname(path: string): string {
  // Handle empty or single character paths
  if (!path || path.length <= 1) {
    return path === '/' ? '/' : '.';
  }
  
  // Normalize the path
  path = normalize(path);
  
  // Handle root path
  if (path === '/') return '/';
  
  // Remove trailing slash if present
  if (path.charAt(path.length - 1) === '/') {
    path = path.slice(0, -1);
  }
  
  // Find the last separator
  const lastSepIndex = path.lastIndexOf('/');
  
  if (lastSepIndex === -1) {
    // No separator found
    return '.';
  }
  
  if (lastSepIndex === 0) {
    // Root directory is the parent
    return '/';
  }
  
  // Return everything before the last separator
  return path.slice(0, lastSepIndex);
}

/**
 * Return the last portion of a path
 * @param path The path to process
 * @param ext Optionally, an extension to remove from the result
 * @returns The basename
 */
export function basename(path: string, ext?: string): string {
  // Handle empty path
  if (!path) return '';
  
  // Normalize the path
  const normalizedPath = normalize(path);
  
  // Remove trailing slash if present
  let pathToProcess = normalizedPath;
  if (pathToProcess.charAt(pathToProcess.length - 1) === '/' && pathToProcess !== '/') {
    pathToProcess = pathToProcess.slice(0, -1);
  }
  
  // Find the last separator
  const lastSepIndex = pathToProcess.lastIndexOf('/');
  
  // Extract the basename
  const base = lastSepIndex !== -1 
    ? pathToProcess.slice(lastSepIndex + 1) 
    : pathToProcess;
  
  // Remove the extension if requested
  if (ext && base.indexOf(ext) === base.length - ext.length) {
    return base.slice(0, base.length - ext.length);
  }
  
  return base;
}

/**
 * Return the extension of the path including the leading dot
 * @param path The path to process
 * @returns The extension including dot (e.g., '.js')
 */
export function extname(path: string): string {
  // Get the basename first
  const base = basename(path);
  
  // Find the last dot
  const lastDotIndex = base.lastIndexOf('.');
  
  // If there's no dot, or it's the first character, there's no extension
  if (lastDotIndex <= 0) {
    return '';
  }
  
  // Return everything including and after the dot
  return base.slice(lastDotIndex);
}

/**
 * Check if path is absolute
 * @param path Path to check
 * @returns True if the path is absolute
 */
export function isAbsolute(path: string): boolean {
  return path.charAt(0) === '/';
}

/**
 * Return the relative path from 'from' to 'to'
 * @param from Source path
 * @param to Destination path
 * @returns Relative path
 */
export function relative(from: string, to: string): string {
  // Normalize paths
  from = normalize(from);
  to = normalize(to);
  
  // If paths are the same, return empty string
  if (from === to) return '';
  
  // Split paths into segments
  const fromSegments = from.split('/').filter(s => s.length > 0);
  const toSegments = to.split('/').filter(s => s.length > 0);
  
  // Find common prefix
  let commonPrefixLength = 0;
  const minLength = Math.min(fromSegments.length, toSegments.length);
  
  while (commonPrefixLength < minLength && 
         fromSegments[commonPrefixLength] === toSegments[commonPrefixLength]) {
    commonPrefixLength++;
  }
  
  // Build the relative path
  const upSegments = fromSegments.length - commonPrefixLength;
  const upPath = new Array(upSegments).fill('..').join('/');
  
  const downPath = toSegments.slice(commonPrefixLength).join('/');
  
  if (!upPath && !downPath) return '.';
  if (!upPath) return downPath;
  if (!downPath) return upPath;
  
  return upPath + '/' + downPath;
}

/**
 * Parse a path into an object with root, dir, base, ext, and name properties
 * @param path Path to parse
 * @returns Parsed path object
 */
export function parse(path: string): {
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
} {
  const root = path.charAt(0) === '/' ? '/' : '';
  const dir = dirname(path);
  const base = basename(path);
  const ext = extname(path);
  const name = ext ? base.slice(0, base.length - ext.length) : base;
  
  return { root, dir, base, ext, name };
}

/**
 * Join an object with path properties into a path string
 * Opposite of parse()
 * @param pathObj Object with path properties
 * @returns Formatted path string
 */
export function format(pathObj: {
  root?: string;
  dir?: string;
  base?: string;
  ext?: string;
  name?: string;
}): string {
  // Handle different component combinations
  if (pathObj.dir && pathObj.base) {
    return join(pathObj.dir, pathObj.base);
  }
  
  if (pathObj.root && pathObj.name && pathObj.ext) {
    return join(pathObj.root, pathObj.name + pathObj.ext);
  }
  
  if (pathObj.dir) return pathObj.dir;
  if (pathObj.root) return pathObj.root;
  
  if (pathObj.name && pathObj.ext) {
    return pathObj.name + pathObj.ext;
  }
  
  if (pathObj.name) return pathObj.name;
  if (pathObj.base) return pathObj.base;
  
  return '';
}

// Default export with all path functions
export default {
  sep,
  delimiter,
  normalize,
  join,
  resolve,
  dirname,
  basename,
  extname,
  isAbsolute,
  relative,
  parse,
  format
}; 