import signify, { HabState, SignifyClient } from "signify-ts";
import { User, CredentialInfo } from "./utils/handle-json-config";
export declare class VleiIssuance {
    configPath: string;
    configJson: any;
    users: Array<User>;
    clients: Map<string, Array<SignifyClient>>;
    aids: Map<string, Array<any>>;
    oobis: Map<string, Array<any>>;
    credentialsInfo: Map<string, CredentialInfo>;
    registries: Map<string, {
        regk: string;
    }>;
    credentials: Map<string, any>;
    schemas: any;
    rules: any;
    credentialData: Map<string, any>;
    aidsInfo: Map<string, any>;
    kargsAID: {
        toad: number;
        wits: string[];
    } | {
        toad?: undefined;
        wits?: undefined;
    };
    constructor(configJson: any);
    prepareClients(): Promise<void>;
    protected createClients(): Promise<void>;
    protected createAids(): Promise<void>;
    protected createMultisigAids(): Promise<void>;
    protected createMultisigDelegatedAids(): Promise<void>;
    protected fetchOobis(): Promise<void>;
    protected createContacts(): Promise<void>;
    protected resolveOobis(schemaUrls: string[]): Promise<void>;
    createRegistries(): Promise<void>;
    private getOrCreateRegistry;
    createAidSinglesig(aidInfo: any): Promise<signify.HabState>;
    createAidMultisig(aidInfo: any): Promise<signify.HabState>;
    createDelegatedAidMultisig(aidInfo: any): Promise<signify.HabState>;
    createRegistryMultisig(multisigAid: HabState, aidInfo: any): Promise<any>;
    buildCredSource(credType: string, cred: any, o?: string): signify.Dict<any>;
    getOrIssueCredential(credId: string, credName: string, attributes: any, issuerAidKey: string, issueeAidKey: string, credSourceId?: string, generateTestData?: boolean, testName?: string): Promise<any>;
    revokeCredential(credId: string, issuerAidKey: string, issueeAidKey: string, generateTestData?: boolean, testName?: string): Promise<any[]>;
    getOrIssueCredentialSingleSig(credId: string, credName: string, attributes: any, issuerAidKey: string, issueeAidKey: string, credSourceId?: string, generateTestData?: boolean, testName?: string): Promise<any>;
    getOrIssueCredentialMultiSig(credId: string, credName: string, attributes: any, issuerAidKey: string, issueeAidKey: string, credSourceId?: string, generateTestData?: boolean, testName?: string): Promise<any[]>;
    revokeCredentialSingleSig(credId: string, issuerAidKey: string, issueeAidKey: string, generateTestData?: boolean, testName?: string): Promise<any[]>;
    revokeCredentialMultiSig(credId: string, issuerAidKey: string, issueeAidKey: string, generateTestData?: boolean, testName?: string): Promise<any[]>;
}
