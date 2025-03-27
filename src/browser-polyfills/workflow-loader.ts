/**
 * Browser-compatible workflow loader
 * This provides functionality to load workflows in a browser environment
 */

import { Workflow } from '../types/workflow.js';
import yaml from 'js-yaml';
import { loadResource, resourceUrls } from './globals.js';

/**
 * Map of preloaded workflow contents
 * This allows workflows to be preloaded or bundled with the application
 */
const preloadedWorkflows: Record<string, string> = {};

/**
 * Map of preloaded configuration contents
 * This allows configurations to be preloaded or bundled with the application
 */
const preloadedConfigs: Record<string, string> = {};

/**
 * Load a workflow from a file path or URL
 * @param path Path to the workflow file
 * @returns The loaded workflow or null if it couldn't be loaded
 */
export async function loadWorkflow(path: string): Promise<Workflow | null> {
  try {
    let workflowContent: string;

    // Check if we have a preloaded workflow
    if (preloadedWorkflows[path]) {
      workflowContent = preloadedWorkflows[path];
    } else {
      // Try to load from the resource URLs
      workflowContent = await loadResource(path);
    }

    return yaml.load(workflowContent) as Workflow;
  } catch (error) {
    console.error(`Failed to load workflow from ${path}: ${error}`);
    return null;
  }
}

/**
 * Load a configuration from a file path or URL
 * @param path Path to the configuration file
 * @returns The loaded configuration or null if it couldn't be loaded
 */
export async function loadConfig(path: string): Promise<any | null> {
  try {
    let configContent: string;

    // Check if we have a preloaded config
    if (preloadedConfigs[path]) {
      configContent = preloadedConfigs[path];
    } else {
      // Try to load from the resource URLs
      configContent = await loadResource(path);
    }

    return JSON.parse(configContent);
  } catch (error) {
    console.error(`Failed to load config from ${path}: ${error}`);
    return null;
  }
}

/**
 * Preload a workflow for later use
 * @param path Virtual path to associate with the workflow
 * @param content YAML content of the workflow
 */
export function preloadWorkflow(path: string, content: string): void {
  preloadedWorkflows[path] = content;
}

/**
 * Preload a configuration for later use
 * @param path Virtual path to associate with the config
 * @param content JSON content of the config
 */
export function preloadConfig(path: string, content: string): void {
  preloadedConfigs[path] = content;
}

/**
 * Register a workflow resource URL
 * @param path Virtual path to the workflow
 * @param url URL to fetch the workflow from
 */
export function registerWorkflowUrl(path: string, url: string): void {
  resourceUrls[path] = url;
}

/**
 * Register a config resource URL
 * @param path Virtual path to the config
 * @param url URL to fetch the config from
 */
export function registerConfigUrl(path: string, url: string): void {
  resourceUrls[path] = url;
}

/**
 * Get all available workflows
 * @returns Array of available workflow paths
 */
export function getAvailableWorkflows(): string[] {
  const workflowPaths: string[] = [];

  // Add paths from preloaded workflows
  for (const path of Object.keys(preloadedWorkflows)) {
    if (path.endsWith('.yaml') || path.endsWith('.yml')) {
      workflowPaths.push(path);
    }
  }

  // Add paths from resource URLs
  for (const path of Object.keys(resourceUrls)) {
    if (
      (path.endsWith('.yaml') || path.endsWith('.yml')) &&
      !workflowPaths.includes(path)
    ) {
      workflowPaths.push(path);
    }
  }

  return workflowPaths;
}

export default {
  loadWorkflow,
  loadConfig,
  preloadWorkflow,
  preloadConfig,
  registerWorkflowUrl,
  registerConfigUrl,
  getAvailableWorkflows,
};
