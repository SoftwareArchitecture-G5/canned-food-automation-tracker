"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Maintenance } from "@/type/maintenance";
import MaintenanceTable from "@/components/maintenance-page/MaintenanceTable";
import MaintenanceCreateDialog from "@/components/maintenance-page/MaintenanceCreateDialog";
import {fetchMaintenanceData} from "@/app/maintenance/get-all-by-automation-id/[automationId]/action";


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
        if (automationId) {
            fetchMaintenanceData(automationId).then(setMaintenanceData);
        }
    }, [automationId]);

    useEffect(() => {
        params.then((resolvedParams) => setAutomationId(resolvedParams.automationId));
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
            <MaintenanceCreateDialog automationId={automationId} />
            <MaintenanceTable data={filteredData} />
        </div>
    );
}
