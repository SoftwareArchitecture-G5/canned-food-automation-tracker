"use server"
import {Maintenance, MaintenanceStatus} from "@/type/maintenance";
import {auth} from "@clerk/nextjs/server";

interface UpdateMaintenanceData {
    issue_report: FormDataEntryValue | null;
    date: FormDataEntryValue | null;
    status: MaintenanceStatus;
}

export const fetchMaintenanceData = async (automationId: string | null, page: number = 1, limit: number = 10) => {
    if (!automationId) return [];

    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    const {getToken} = await auth();
    const token = await getToken({template: "automation-tracker"})

    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/get-all-by-automation-id/${automationId}?${params.toString()}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};

export const fetchPaginationMetaData = async (automationId: string | null, page: number, limit: number) => {
    const data = await fetchMaintenanceData(automationId, page + 1, limit);
    return {
        hasNextPage: data.length > 0,
    };
};

export const createMaintenance = async (newMaintenance: any) => {
    const {getToken} = await auth();
    const token = await getToken({template: "automation-tracker"})
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/`;
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(newMaintenance),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error creating maintenance:", error);
        return null;
    }
};

export async function updateMaintenance(
    maintenanceId: string | number,
    data: UpdateMaintenanceData
): Promise<Maintenance> {
    const {getToken} = await auth();
    const token = await getToken({template: "automation-tracker"})
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/${maintenanceId}`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

export async function deleteMaintenance(maintenanceId: string | number): Promise<void> {
    const {getToken} = await auth();
    const token = await getToken({template: "automation-tracker"})
    const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/${maintenanceId}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}
