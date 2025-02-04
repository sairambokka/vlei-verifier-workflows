export declare function buildUserData(jsonConfig: any): Promise<Array<User>>;
export declare function buildCredentials(jsonConfig: any): Promise<Map<string, CredentialInfo>>;
export declare function buildAidData(jsonConfig: any): Promise<any>;
export interface User {
    type: string;
    LE: string;
    alias: string;
    identifiers: any;
}
export interface CredentialInfo {
    type: string;
    schema: string;
    rules?: string;
    privacy: boolean;
    attributes: any;
    credSource?: any;
}
