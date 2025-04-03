"use client";
import { DashboardCard } from "@/components/dashboard-page/dashboard-card";
import { MaintenanceGraph } from "@/components/dashboard-page/maintenance-graph";
import { MaintenanceRatioGraph } from "@/components/dashboard-page/maintenance-ratio-graph";
import { useEffect, useState } from "react";
import { Maintenance } from "@/type/maintenance";
import {fetchMaintenanceData} from "@/app/dashboard/action";


export default function AutomationPage() {
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchMaintenanceData();
                setMaintenanceData(data);
            } catch (error) {
                console.error("Error loading maintenance data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    console.log("Maintenance Data:", maintenanceData);

    const getLast30DaysData = () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return maintenanceData.filter(
            (item) => new Date(item.date) >= thirtyDaysAgo
        );
    };

    const last30DaysData = getLast30DaysData();

    return (
        <div>
            <div className="font-bold text-2xl mb-5">Automation Tracker</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
                <DashboardCard
                    title="Total Automations"
                    description={
                        (last30DaysData.length > 0
                            ? new Set(
                                last30DaysData.map((item) => item.automation.automation_id)
                            ).size.toString()
                            : "0") + " Automations update in 30 days"
                    }
                />
                <DashboardCard
                    title="Total Maintenance"
                    description={last30DaysData.length.toString() + " in 30 days"}
                />
                <DashboardCard
                    title={
                        "Automation Efficiency " +
                        (last30DaysData.length > 0
                            ? (() => {
                                const uniqueAutomations = new Set(
                                    last30DaysData.map((item) => item.automation.automation_id)
                                ).size;

                                return uniqueAutomations > 0
                                    ? `${
                                        Math.round(
                                            (last30DaysData.length / uniqueAutomations) * 10
                                        ) / 10
                                    }/month`
                                    : "N/A";
                            })()
                            : "N/A")
                    }
                    description={
                        "Average number of maintenance issues per automation system per month."
                    }
                />
                <DashboardCard
                    title="Most Maintained System"
                    description={
                        last30DaysData.length > 0
                            ? Object.entries(
                            last30DaysData.reduce<Record<string, number>>((acc, item) => {
                                const name = item.automation.name;
                                acc[name] = (acc[name] || 0) + 1;
                                return acc;
                            }, {})
                        ).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
                            : "N/A"
                    }
                />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                {!isLoading && <MaintenanceGraph maintenanceData={maintenanceData} />}
                {!isLoading && (
                    <MaintenanceRatioGraph maintenanceData={maintenanceData} />
                )}
            </div>
        </div>
    );
}