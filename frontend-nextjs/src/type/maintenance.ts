import { Automation } from "./automation";

export enum MaintenanceStatus {
    "COMPLETED" = "completed",
    "PENDING" = "pending",
}

export interface Maintenance {
    maintenance_id: string;
    issue_report: string;
    date: string;
    status: MaintenanceStatus;
    automation: Automation;
};

export interface MaintenancePaginationMetaData {
    page: number;
    limit: number;
    nextPageExists: boolean;
};
