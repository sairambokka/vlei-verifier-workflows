/**
 * Browser-compatible implementation of Node.js process
 * Provides minimal functionality to support the vlei-verifier-workflows library
 */

// Environment variables - browser environment can use localStorage for persistence
const env: Record<string, string> = {};

// Initialize with some default environment variables
function initializeEnv() {
  // Default values for common environment variables
  const defaults: Record<string, string> = {
    // Standard configuration for direct API connection (not Docker)
    KERIA: 'http://127.0.0.1:3901',
    KERIA_BOOT: 'http://127.0.0.1:3903',
    KERIA_ADMIN_PORT: '3901',
    KERIA_HTTP_PORT: '3902',
    KERIA_BOOT_PORT: '3903',
    VLEI_SERVER: 'http://localhost:7723',
    VLEI_VERIFIER: 'http://localhost:7676',
    // Default workflow and config files
    WORKFLOW: 'singlesig-single-user-light.yaml',
    CONFIGURATION: 'configuration-singlesig-single-user-light.json',
    // Placeholder witness values
    WITNESS_URLS: 'http://witness1.example.com,http://witness2.example.com',
    WITNESS_IDS: 'BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha,BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM',
  };

  // Load stored env vars from localStorage if available
  try {
    const storedEnv = localStorage.getItem('vlei-verifier-env');
    if (storedEnv) {
      const parsed = JSON.parse(storedEnv);
      Object.assign(env, parsed);
    }
  } catch (e) {
    console.warn('Failed to load environment from localStorage:', e);
  }

  // Apply defaults for any missing values
  for (const [key, value] of Object.entries(defaults)) {
    if (!env[key]) {
      env[key] = value;
    }
  }
}

// Initialize the environment
initializeEnv();

/**
 * Save the current environment to localStorage
 */
function persistEnv() {
  try {
    localStorage.setItem('vlei-verifier-env', JSON.stringify(env));
  } catch (e) {
    console.warn('Failed to persist environment to localStorage:', e);
  }
}

/**
 * Set an environment variable
 */
function setEnv(key: string, value: string) {
  env[key] = value;
  persistEnv();
}

/**
 * Get the current working directory
 * In browser environment, we use a virtual directory
 */
function cwd(): string {
  return '/virtual/workdir';
}

/**
 * Event handlers for various process events
 */
const eventHandlers: Record<string, Array<(...args: any[]) => void>> = {
  beforeExit: [],
  exit: [],
};

/**
 * Register an event handler
 */
function on(event: string, handler: (...args: any[]) => void) {
  if (!eventHandlers[event]) {
    eventHandlers[event] = [];
  }
  eventHandlers[event].push(handler);
  
  // For browser environment, we can use window events as approximations
  if (event === 'beforeExit') {
    window.addEventListener('beforeunload', () => {
      eventHandlers.beforeExit.forEach(h => h());
    });
  }
  
  return this; // For chaining
}

/**
 * Mock exit function that logs instead of actually exiting
 */
function exit(code: number = 0) {
  console.warn(`Process exit requested with code ${code} (simulated in browser)`);
  
  // Trigger exit handlers
  if (eventHandlers.exit) {
    eventHandlers.exit.forEach(handler => {
      try {
        handler(code);
      } catch (e) {
        console.error('Error in exit handler:', e);
      }
    });
  }
}

/**
 * Parse command line arguments from URL parameters
 * This simulates process.argv in a browser context
 */
function parseArgv(): string[] {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  
  // Start with the executable and script name (simulated)
  const argv = ['node', 'browser-script.js'];
  
  // Add all URL parameters
  for (const [key, value] of params.entries()) {
    if (value === 'true' || value === '') {
      // Flag parameter
      argv.push(`--${key}`);
    } else {
      // Key-value parameter
      argv.push(`--${key}=${value}`);
    }
  }
  
  return argv;
}

// Parse command line args on initialization
const argv = parseArgv();

// Build and export the process object
const processPolyfill = {
  env,
  cwd,
  on,
  exit,
  argv,
  // Expose setEnv for browser environment to allow configuration
  setEnv,
  
  // Additional properties for compatibility
  browser: true,
  title: 'browser',
  version: 'v1.0.0-browser',
  platform: 'browser',
  
  // stdout/stderr mock implementations
  stdout: {
    write: (data: string) => {
      console.log(data);
      return true;
    }
  },
  stderr: {
    write: (data: string) => {
      console.error(data);
      return true;
    }
  },
};

export default processPolyfill; 