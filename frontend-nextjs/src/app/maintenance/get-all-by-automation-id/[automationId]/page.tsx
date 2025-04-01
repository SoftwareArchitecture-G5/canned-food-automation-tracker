"use client"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Maintenance } from "@/type/maintenance";
import MaintenanceTable from "@/components/maintenance-page/MaintenanceTable";
import MaintenanceCreateDialog from "@/components/maintenance-page/MaintenanceCreateDialog";
import { useSearchParams } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";


export default function MaintenancePage({ params }: { params: Promise<{ automationId: string }> }) {
    const [search, setSearch] = useState("");
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const [automationId, setAutomationId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const router = useRouter(); // #TODO use hooks instead of router

    // Filtered data based on search input
    const filteredData = maintenanceData.filter(
        (item) =>
            item.issue_report.toLowerCase().includes(search.toLowerCase()) ||
            item.automation.name.toLowerCase().includes(search.toLowerCase())
    );

    const prevPage = () => {
        if (page > 1) {
            router.push(`?page=${page - 1}&limit=${limit}`);
        }
    };

    const nextPage = () => {
        router.push(`?page=${page + 1}&limit=${limit}`);
    };

    const fetchData = async () => {
        if (automationId) {
            const params = new URLSearchParams(); // For easy URL building
            if (page) params.append('page', String(page));
            if (limit) params.append('limit', String(limit));

            const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/get-all-by-automation-id/${automationId}?${params.toString()}`;
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

    // const hasNextPage = () => {
    //     fetchData(page)
    // }

    // Fetch maintenance data once automationId is available
    useEffect(() => {
        fetchData();
    }, [automationId, maintenanceData]); // Re-fetch when automationId and maintenanceData changes

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

            <Pagination className="mt-3">
            <PaginationContent>
                {/* Prev Button */}
                { page > 1 && (
                <PaginationPrevious onClick={prevPage} />
                )}

                {/* Prev Ellipsis */}
                {page > 2 && (
                    <PaginationEllipsis />
                )}

                {/* Prev Page */}
                { page > 1 && (
                    <PaginationLink onClick={prevPage}>{page - 1}</PaginationLink>
                )}

                {/* Current Page */}
                <PaginationLink isActive>{page}</PaginationLink>

                {/* Next Page */}
                { maintenanceData.length == limit && (
                <PaginationLink onClick={nextPage}>{page + 1}</PaginationLink>
                )}

                {/* Next Ellipsis */}
                { maintenanceData.length == limit && (
                <PaginationEllipsis />
                )}

                {/* Next Button */} 
                {/* todo fetch the next 1 row, if have include else don't */}
                { maintenanceData.length == limit && (
                <PaginationNext onClick={nextPage} />
                )}
            </PaginationContent>
            </Pagination>
        </div>
    );
}
