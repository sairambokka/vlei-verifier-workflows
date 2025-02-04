export declare function buildTestData(testData: EcrTestData, testName: string, issueName: string, fileNamePrefix?: string): Promise<string>;
export interface EcrTestData {
    aid: string;
    credential: any;
    lei: string;
    engagementContextRole: string;
}
