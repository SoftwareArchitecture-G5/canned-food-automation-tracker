import { Automation } from "./automation";

export enum MaintenanceStatus {
    "COMPLETED" = "completed",
    "PENDING" = "pending",
}

export type Maintenance = {
    maintenance_id: string;
    issue_report: string;
    date: string;
    status: MaintenanceStatus;
    automation: Automation;
};