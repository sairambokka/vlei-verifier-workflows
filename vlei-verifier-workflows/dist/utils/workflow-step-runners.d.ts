import { VleiIssuance } from "../vlei-issuance";
export declare abstract class StepRunner {
    type: string;
    abstract run(vi: VleiIssuance, stepName: string, step: any, configJson: any): Promise<any>;
}
export declare class IssueCredentialStepRunner extends StepRunner {
    type: string;
    run(vi: VleiIssuance, stepName: string, step: any, configJson?: any): Promise<any>;
}
export declare class RevokeCredentialStepRunner extends StepRunner {
    type: string;
    run(vi: VleiIssuance, stepName: string, step: any, configJson?: any): Promise<any>;
}
