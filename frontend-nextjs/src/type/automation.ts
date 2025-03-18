export enum AutomationStatus {
    "ACTIVE" = "active",
    "INACTIVE" = "inactive",
}

export interface Automation {
    automation_id: string;
    name: string;
    description: string;
    status: AutomationStatus;
    created_at: string;
    updated_at: string;
}