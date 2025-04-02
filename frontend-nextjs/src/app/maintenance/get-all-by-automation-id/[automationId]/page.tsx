"use client"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Maintenance } from "@/type/maintenance";
import MaintenanceTable from "@/components/maintenance-page/MaintenanceTable";
import MaintenanceCreateDialog from "@/components/maintenance-page/MaintenanceCreateDialog";



export default function MaintenancePage({ params }: { params: Promise<{ automationId: string }> }) {
    const [search, setSearch] = useState("");
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const [automationId, setAutomationId] = useState<string | null>(null);

    // Filtered data based on search input
    const filteredData = maintenanceData.filter(
        (item) =>
            item.issue_report.toLowerCase().includes(search.toLowerCase()) ||
            item.automation.name.toLowerCase().includes(search.toLowerCase())
    );

    // Fetch maintenance data once automationId is available
    useEffect(() => {
        const fetchData = async () => {
            if (automationId) {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/get-all-by-automation-id/${automationId}`;
                try {
                    const response = await fetch(url, {
                        headers: { "Content-Type": "application/json" },
                        method: "GET",
                        credentials: "include",
                    });
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const data: Maintenance[] = await response.json();
                    setMaintenanceData(data);
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            }
        };

        fetchData();
    }, [automationId]); // Re-fetch when automationId changes

    useEffect(() => {
        const getAutomationId = async () => {
            const resolvedParams = await params;
            setAutomationId(resolvedParams.automationId);
        };

        getAutomationId();
    }, [params]);


    return (
        <div>
            <div className="font-bold text-2xl mb-5">Maintenance Tracker</div>
                <Input
                    placeholder="Search by issue or automation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md mb-5"
                />
            <MaintenanceCreateDialog automationId={ automationId }/>
            <MaintenanceTable data={ filteredData }/>
        </div>
    );
}
