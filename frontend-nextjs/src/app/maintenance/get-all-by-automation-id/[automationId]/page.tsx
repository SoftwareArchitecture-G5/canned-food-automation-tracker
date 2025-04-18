"use client";
import { Input } from "@/components/ui/input";
import MaintenanceTable from "@/components/maintenance-page/MaintenanceTable";
import MaintenanceCreateDialog from "@/components/maintenance-page/MaintenanceCreateDialog";
import MaintenancePagination from "@/components/maintenance-page/MaintenancePagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Maintenance } from "@/type/maintenance";
import {fetchPaginationMetaData } from "./action";
import {fetchMaintenanceData} from "@/app/maintenance/get-all-by-automation-id/[automationId]/action";


export default function MaintenancePage({ params }: { params: Promise<{ automationId: string }> }) {
    const [search, setSearch] = useState("");
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const [automationId, setAutomationId] = useState<string | null>(null);
    const [nextPageExists, setNextPageExists] = useState(false);
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const filteredData = maintenanceData.filter(item =>
        item.issue_report.toLowerCase().includes(search.toLowerCase()) ||
        item.automation.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchMaintenanceData(automationId, page, limit);
            setMaintenanceData(data);
        };

        const fetchPageMetaData = async () => {
            const checkPage = await fetchPaginationMetaData(automationId, page, limit);
            setNextPageExists(checkPage.hasNextPage);
        };

        fetchData();
        fetchPageMetaData();
    }, [automationId, page, limit]);

    useEffect(() => {
        const getAutomationId = async () => {
            const resolvedParams = await params;
            setAutomationId(resolvedParams.automationId);
        };

        getAutomationId();
    });

    const paginationMetaData = {
        page,
        limit,
        nextPageExists,
    };

    return (
        <div className="h-screen">
            <div className="font-bold text-2xl mb-5">Maintenance Tracker</div>
            <div className="flex flex-row gap-x-4 py-5">
                <Input
                    placeholder="Search by issue or automation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md mb-5"
                />
                <MaintenanceCreateDialog automationId={automationId} />
            </div>
            <MaintenanceTable data={filteredData} />
            <MaintenancePagination paginationMetaData={paginationMetaData} />
        </div>
    );
}
