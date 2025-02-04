import { VleiIssuance } from "../vlei-issuance";
import { StepRunner } from "./workflow-step-runners";
export declare class WorkflowRunner {
    stepRunners: Map<string, StepRunner>;
    configJson: any;
    workflow: any;
    vi: VleiIssuance;
    executedSteps: Set<unknown>;
    constructor(workflow: any, configJson: any);
    private registerPredefinedRunners;
    prepareClients(): Promise<void>;
    registerRunner(name: string, runner: StepRunner): void;
    runWorkflow(): Promise<boolean>;
}
