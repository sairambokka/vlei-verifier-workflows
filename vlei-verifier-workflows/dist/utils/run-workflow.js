"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowRunner = void 0;
const vlei_issuance_1 = require("../vlei-issuance");
const workflow_step_runners_1 = require("./workflow-step-runners");
const fs = require("fs");
const yaml = require("js-yaml");
class WorkflowRunner {
    constructor(workflow, configJson) {
        this.stepRunners = new Map();
        this.executedSteps = new Set();
        this.configJson = configJson;
        this.workflow = workflow;
        this.vi = new vlei_issuance_1.VleiIssuance(this.configJson);
        this.registerPredefinedRunners();
    }
    registerPredefinedRunners() {
        this.registerRunner("issue_credential", new workflow_step_runners_1.IssueCredentialStepRunner());
        this.registerRunner("revoke_credential", new workflow_step_runners_1.RevokeCredentialStepRunner());
    }
    async prepareClients() {
        await this.vi.prepareClients();
        await this.vi.createRegistries();
    }
    registerRunner(name, runner) {
        this.stepRunners.set(name, runner);
    }
    async runWorkflow() {
        for (const [stepName, step] of Object.entries(this.workflow.workflow.steps)) {
            console.log(`Executing: ${step.description}`);
            const runner = this.stepRunners.get(step.type);
            if (!runner) {
                console.log(`No step runner was registered for step '${step.type}'`);
                return false;
            }
            await (runner === null || runner === void 0 ? void 0 : runner.run(this.vi, stepName, step, this.configJson));
            this.executedSteps.add(step.id);
        }
        console.log(`Workflow steps execution finished successfully`);
        return true;
    }
}
exports.WorkflowRunner = WorkflowRunner;
