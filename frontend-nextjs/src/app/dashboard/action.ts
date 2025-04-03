"use server";

import {Maintenance} from "@/type/maintenance";
import {auth} from "@clerk/nextjs/server";

export async function fetchMaintenanceData(
    startDate?: string,
    endDate?: string
): Promise<Maintenance[]> {
    const {getToken} = await auth();
    const token = await getToken({template: "automation-tracker"})
    try {
        // If dates aren't provided, default to last 6 months
        if (!startDate || !endDate) {
            const today = new Date();
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(today.getMonth() - 5);

            startDate = sixMonthsAgo.toISOString().split("T")[0];
            endDate = today.toISOString().split("T")[0];
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/date-range?startDate=${startDate}&endDate=${endDate}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        const data: Maintenance[] = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}