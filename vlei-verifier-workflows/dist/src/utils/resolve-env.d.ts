export type TestEnvironmentPreset = "local" | "docker" | "rootsid_dev" | "rootsid_test" | "bank_test" | "nordlei_dev" | "nordlei_demo" | "nordlei_dry";
export interface TestEnvironment {
    preset: TestEnvironmentPreset;
    url: string;
    bootUrl: string;
    vleiServerUrl: string;
    witnessUrls: string[];
    witnessIds: string[];
    apiBaseUrl: string;
    proxyBaseUrl: string;
    verifierBaseUrl: string;
    workflow: string;
    configuration: string;
}
export declare function resolveEnvironment(input?: TestEnvironmentPreset): TestEnvironment;
