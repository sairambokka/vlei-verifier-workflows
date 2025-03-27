// Define a simple Buffer type for browsers that matches the basic needs
class BrowserBuffer {
  public data: Uint8Array;

  constructor(input: string | Uint8Array | number[] | ArrayBuffer) {
    if (typeof input === 'string') {
      // Convert string to Uint8Array
      const encoder = new TextEncoder();
      this.data = encoder.encode(input);
    } else if (input instanceof Uint8Array) {
      this.data = input;
    } else if (Array.isArray(input)) {
      // Convert number array to Uint8Array
      this.data = new Uint8Array(input);
    } else if (input instanceof ArrayBuffer) {
      this.data = new Uint8Array(input);
    } else {
      throw new Error('Unsupported input type for BrowserBuffer');
    }
  }

  toString(_encoding?: string): string {
    // Simple implementation that always returns UTF-8
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(this.data);
  }

  toJSON(): { type: string; data: number[] } {
    return {
      type: 'Buffer',
      data: Array.from(this.data),
    };
  }
}

// Provide a Buffer type that can be used in the browser
type Buffer = BrowserBuffer;
const Buffer = BrowserBuffer;

// IndexedDB-based filesystem implementation
const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('virtual-fs-db', 1);

  request.onupgradeneeded = (_event) => {
    const db = request.result;
    // Create object stores if they don't exist
    if (!db.objectStoreNames.contains('files')) {
      db.createObjectStore('files');
    }
    if (!db.objectStoreNames.contains('directories')) {
      db.createObjectStore('directories');
    }
  };

  request.onsuccess = () => {
    console.log('Initialized virtual filesystem database');
    resolve(request.result);
  };

  request.onerror = () => {
    console.error('Failed to open IndexedDB database for virtual filesystem');
    reject(request.error);
  };
});

// Constants and types
const FILES_STORE = 'files';
const DIRECTORIES_STORE = 'directories';

interface FileData {
  content: string | Uint8Array;
  encoding?: string;
  lastModified: number;
}

// This interface is not directly used but kept for documentation
interface _Directory {
  path: string;
  created: number;
}

/**
 * Normalize a path by removing duplicate slashes and resolving . and ..
 */
function normalizePath(path: string): string {
  // Handle empty path
  if (!path) return '/';

  // Replace backslashes with forward slashes
  path = path.replace(/\\/g, '/');

  // Ensure path starts with a slash for absolute paths
  const isAbsolute = path.startsWith('/');
  if (!isAbsolute) {
    path = '/' + path;
  }

  // Split the path into segments
  const segments = path.split('/').filter((s) => s.length > 0);
  const resultSegments: string[] = [];

  // Process each segment
  for (const segment of segments) {
    if (segment === '.') {
      // Skip '.' segments
      continue;
    } else if (segment === '..') {
      // Go up one level for '..' segments
      resultSegments.pop();
    } else {
      // Add normal segment
      resultSegments.push(segment);
    }
  }

  // Reconstruct the path
  let result = isAbsolute ? '/' : '';
  result += resultSegments.join('/');

  return result || '/';
}

/**
 * Get the parent directory path
 */
function getDirectoryPath(filePath: string): string {
  const normalized = normalizePath(filePath);
  const lastSlashIndex = normalized.lastIndexOf('/');

  if (lastSlashIndex <= 0) {
    return '/';
  }

  return normalized.substring(0, lastSlashIndex);
}

/**
 * Create a directory and its parent directories if they don't exist
 */
async function ensureDirectoryExists(path: string): Promise<void> {
  const db = await dbPromise;
  path = normalizePath(path);

  // Check if the directory already exists
  const tx = db.transaction(DIRECTORIES_STORE, 'readonly');
  const store = tx.objectStore(DIRECTORIES_STORE);
  const exists = await new Promise<boolean>((resolve) => {
    const request = store.get(path);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => resolve(false);
  });

  if (exists) return;

  // Create parent directories first
  const parentPath = getDirectoryPath(path);
  if (parentPath !== path) {
    await ensureDirectoryExists(parentPath);
  }

  // Create this directory
  const writeTx = db.transaction(DIRECTORIES_STORE, 'readwrite');
  const writeStore = writeTx.objectStore(DIRECTORIES_STORE);
  await new Promise<void>((resolve, reject) => {
    const request = writeStore.put(
      {
        path,
        created: Date.now(),
      },
      path
    );

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Synchronous file read implementation (Browser compatibility)
 *
 * Note: This is synchronous in its API, but asynchronous in implementation.
 * It's not a true synchronous function as browsers don't support synchronous IndexedDB.
 * This is a compromise for compatibility.
 */
function readFileSync(
  path: string,
  _options?: string | { encoding?: string; flag?: string }
): string | Buffer {
  console.warn('readFileSync is not truly synchronous in browser environment');

  // We use localStorage as a cache for the last read to simulate sync behavior
  const cacheKey = `fs-cache:${path}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (typeof data.content === 'string') {
        return data.content;
      } else if (Array.isArray(data.content)) {
        return new Buffer(new Uint8Array(data.content));
      }
    } catch (e) {
      console.warn('Error parsing cached file data:', e);
    }
  }

  throw new Error(
    'Cannot synchronously read files in browser environment without prior async access'
  );
}

/**
 * Asynchronous file read implementation
 */
async function readFile(
  path: string,
  options?: string | { encoding?: string; flag?: string },
  callback?: (err: Error | null, data: string | Buffer) => void
): Promise<string | Buffer | undefined> {
  const _encoding = typeof options === 'string' ? options : options?.encoding;
  path = normalizePath(path);

  try {
    const db = await dbPromise;
    const tx = db.transaction(FILES_STORE, 'readonly');
    const store = tx.objectStore(FILES_STORE);

    const fileData = await new Promise<FileData | undefined>(
      (resolve, reject) => {
        const request = store.get(path);
        request.onsuccess = () => resolve(request.result as FileData);
        request.onerror = () => reject(request.error);
      }
    );

    if (!fileData) {
      const error = new Error(`ENOENT: no such file or directory, '${path}'`);
      if (callback) {
        callback(error, '' as any);
        return;
      }
      throw error;
    }

    let result: string | Buffer;
    if (typeof fileData.content === 'string') {
      result = fileData.content;
    } else {
      result = new Buffer(fileData.content);
    }

    // Cache the result for potential readFileSync calls
    try {
      localStorage.setItem(
        `fs-cache:${path}`,
        JSON.stringify({
          content: fileData.content,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Error caching file data:', e);
    }

    if (callback) {
      callback(null, result);
      return;
    }

    return result;
  } catch (error) {
    if (callback) {
      callback(error as Error, '' as any);
      return;
    }
    throw error;
  }
}

/**
 * Write data to a file
 */
async function writeFile(
  path: string,
  data: string | Buffer | Uint8Array,
  _options?: string | { encoding?: string; _mode?: number; flag?: string },
  callback?: (err: Error | null) => void
): Promise<void> {
  const _encoding =
    typeof _options === 'string' ? _options : _options?.encoding;
  path = normalizePath(path);

  try {
    // Ensure the directory exists
    const dirPath = getDirectoryPath(path);
    await ensureDirectoryExists(dirPath);

    // Convert Buffer to serializable content
    let content: string | Uint8Array;
    if (data instanceof Buffer) {
      // For serialization, we need a plain array
      content = new Uint8Array(Array.from((data as any).data));
    } else {
      content = data;
    }

    // Store the file
    const db = await dbPromise;
    const tx = db.transaction(FILES_STORE, 'readwrite');
    const store = tx.objectStore(FILES_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(
        {
          content,
          encoding: _encoding,
          lastModified: Date.now(),
        },
        path
      );

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Update the cache
    try {
      localStorage.setItem(
        `fs-cache:${path}`,
        JSON.stringify({
          content,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Error caching file data:', e);
    }

    if (callback) callback(null);
  } catch (error) {
    if (callback) {
      callback(error as Error);
      return;
    }
    throw error;
  }
}

/**
 * Check if a file or directory exists
 */
async function exists(
  path: string,
  callback?: (exists: boolean) => void
): Promise<boolean | undefined> {
  path = normalizePath(path);

  try {
    const db = await dbPromise;
    const fileTx = db.transaction(FILES_STORE, 'readonly');
    const fileStore = fileTx.objectStore(FILES_STORE);

    const fileExists = await new Promise<boolean>((resolve) => {
      const request = fileStore.get(path);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });

    if (fileExists) {
      if (callback) callback(true);
      return true;
    }

    const dirTx = db.transaction(DIRECTORIES_STORE, 'readonly');
    const dirStore = dirTx.objectStore(DIRECTORIES_STORE);

    const dirExists = await new Promise<boolean>((resolve) => {
      const request = dirStore.get(path);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });

    if (callback) callback(dirExists);
    return dirExists;
  } catch (_error) {
    if (callback) {
      callback(false);
      return;
    }
    return false;
  }
}

/**
 * Create a directory
 */
async function mkdir(
  path: string,
  options?: { recursive?: boolean; _mode?: number } | number,
  callback?: (err: Error | null) => void
): Promise<void> {
  path = normalizePath(path);
  const recursive = typeof options === 'object' ? options?.recursive : false;

  try {
    if (recursive) {
      // Create parent directories recursively
      await ensureDirectoryExists(path);
    } else {
      // Non-recursive - only create if parent exists
      const parentPath = getDirectoryPath(path);

      const db = await dbPromise;
      const tx = db.transaction(DIRECTORIES_STORE, 'readonly');
      const store = tx.objectStore(DIRECTORIES_STORE);

      const parentExists = await new Promise<boolean>((resolve) => {
        const request = store.get(parentPath);
        request.onsuccess = () => resolve(!!request.result);
        request.onerror = () => resolve(false);
      });

      if (!parentExists) {
        throw new Error(
          `ENOENT: parent directory does not exist '${parentPath}'`
        );
      }

      const writeTx = db.transaction(DIRECTORIES_STORE, 'readwrite');
      const writeStore = writeTx.objectStore(DIRECTORIES_STORE);

      await new Promise<void>((resolve, reject) => {
        const request = writeStore.put(
          {
            path,
            created: Date.now(),
          },
          path
        );

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    if (callback) callback(null);
  } catch (error) {
    if (callback) {
      callback(error as Error);
      return;
    }
    throw error;
  }
}

/**
 * Read a directory's contents
 */
async function readdir(
  path: string,
  _options?: { encoding?: string; withFileTypes?: boolean },
  callback?: (err: Error | null, files: string[]) => void
): Promise<string[] | undefined> {
  path = normalizePath(path);
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  try {
    const db = await dbPromise;

    // Check if directory exists
    const dirTx = db.transaction(DIRECTORIES_STORE, 'readonly');
    const dirStore = dirTx.objectStore(DIRECTORIES_STORE);

    const dirExists = await new Promise<boolean>((resolve) => {
      const request = dirStore.get(path);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });

    if (!dirExists && path !== '/') {
      const error = new Error(`ENOENT: no such directory, '${path}'`);
      if (callback) {
        callback(error, []);
        return;
      }
      throw error;
    }

    // Get all keys from files store
    const fileTx = db.transaction(FILES_STORE, 'readonly');
    const fileStore = fileTx.objectStore(FILES_STORE);

    const fileKeys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const request = fileStore.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Get all keys from directories store
    const dirListTx = db.transaction(DIRECTORIES_STORE, 'readonly');
    const dirListStore = dirListTx.objectStore(DIRECTORIES_STORE);

    const dirKeys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const request = dirListStore.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Filter to find immediate children of this directory
    const entries: string[] = [];
    const pathPrefix = path === '/' ? '/' : path + '/';

    for (const key of [...fileKeys, ...dirKeys]) {
      const keyStr = key.toString();
      if (keyStr.startsWith(pathPrefix)) {
        // Extract just the name of the immediate child
        const remaining = keyStr.slice(pathPrefix.length);
        const firstSlash = remaining.indexOf('/');
        const entryName =
          firstSlash === -1 ? remaining : remaining.slice(0, firstSlash);

        if (entryName && !entries.includes(entryName)) {
          entries.push(entryName);
        }
      }
    }

    if (callback) {
      callback(null, entries);
      return;
    }

    return entries;
  } catch (error) {
    if (callback) {
      callback(error as Error, []);
      return;
    }
    throw error;
  }
}

/**
 * Synchronous version of readdir
 */
function readdirSync(
  path: string,
  _options?: { encoding?: string; withFileTypes?: boolean }
): string[] {
  console.warn('readdirSync is not truly synchronous in browser environment');

  // Check cache
  const cacheKey = `fs-cache-dir:${path}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Ignore cache parsing errors
    }
  }

  // Can't do true sync in browser
  return [];
}

// Export promises implementation
export const promises = {
  readFile: async (
    path: string,
    options?: string | { encoding?: string; flag?: string }
  ): Promise<string | Buffer> => {
    return readFile(path, options) as Promise<string | Buffer>;
  },

  writeFile: async (
    path: string,
    data: string | Buffer | Uint8Array,
    _options?: string | { encoding?: string; _mode?: number; flag?: string }
  ): Promise<void> => {
    return writeFile(path, data, _options) as Promise<void>;
  },

  mkdir: async (
    path: string,
    options?: { recursive?: boolean; _mode?: number } | number
  ): Promise<void> => {
    return mkdir(path, options) as Promise<void>;
  },

  readdir: async (
    path: string,
    _options?: { encoding?: string; withFileTypes?: boolean }
  ): Promise<string[]> => {
    return readdir(path, _options) as Promise<string[]>;
  },

  access: async (path: string, _mode?: number): Promise<void> => {
    const fileExists = await exists(path);
    if (!fileExists) {
      throw new Error(`ENOENT: no such file or directory, '${path}'`);
    }
  },
};

// Create the default export object
export default {
  readFileSync,
  readFile,
  writeFile,
  exists,
  mkdir,
  readdir,
  readdirSync,
  promises,
};
