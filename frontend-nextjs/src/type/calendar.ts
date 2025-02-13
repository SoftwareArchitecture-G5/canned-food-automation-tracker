import { Automation } from "./automation";


export interface Maintenance {
    maintenance_id: string;
    automation: Automation;
    issue_report: string;
    date: string;
    status: string;
}