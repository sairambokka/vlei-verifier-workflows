import signify, { HabState, CreateIdentiferArgs, CredentialData, Serder, SignifyClient } from "signify-ts";
export interface AcceptMultisigInceptArgs {
    groupName: string;
    localMemberName: string;
    msgSaid: string;
}
export interface StartMultisigInceptArgs {
    groupName: string;
    localMemberName: string;
    participants: string[];
    isith?: number | string | string[];
    nsith?: number | string | string[];
    toad?: number;
    wits?: string[];
    delpre?: string;
}
export declare function acceptMultisigIncept(client2: SignifyClient, { groupName, localMemberName, msgSaid }: AcceptMultisigInceptArgs): Promise<any>;
export declare function addEndRoleMultisig(client: SignifyClient, groupName: string, aid: HabState, otherMembersAIDs: HabState[], multisigAID: HabState, timestamp: string, isInitiator?: boolean): Promise<any[]>;
export declare function admitMultisig(client: SignifyClient, aid: HabState, otherMembersAIDs: HabState[], multisigAID: HabState, recipientAID: HabState, timestamp: string): Promise<void>;
export declare function createAIDMultisig(client: SignifyClient, aid: HabState, otherMembersAIDs: HabState[], groupName: string, kargs: CreateIdentiferArgs, isInitiator?: boolean): Promise<any>;
export declare function createRegistryMultisig(client: SignifyClient, aid: HabState, otherMembersAIDs: HabState[], multisigAID: HabState, registryName: string, nonce: string, isInitiator?: boolean): Promise<any>;
export declare function delegateMultisig(client: SignifyClient, aid: HabState, otherMembersAIDs: HabState[], multisigAID: HabState, anchor: {
    i: string;
    s: string;
    d: string;
}, isInitiator?: boolean): Promise<any>;
export declare function grantMultisig(client: SignifyClient, aid: HabState, otherMembersAIDs: HabState[], multisigAID: HabState, recipientAID: HabState, credential: any, timestamp: string, isInitiator?: boolean): Promise<void>;
export declare function issueCredentialMultisig(client: SignifyClient, aid: HabState, otherMembersAIDs: HabState[], multisigAIDName: string, kargsIss: CredentialData, isInitiator?: boolean): Promise<signify.Operation<unknown>>;
export declare function multisigRevoke(client: SignifyClient, memberName: string, groupName: string, rev: Serder, anc: Serder): Promise<void>;
export declare function startMultisigIncept(client: SignifyClient, { groupName, localMemberName, participants, ...args }: StartMultisigInceptArgs): Promise<any>;
export declare function waitAndMarkNotification(client: SignifyClient, route: string): Promise<string>;
