"use client"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Maintenance } from "@/type/maintenance";

export default function MaintenanceTable() {

    const [search, setSearch] = useState("");
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);

    // Filtered data based on search input
    const filteredData = maintenanceData.filter(
        (item) =>
        item.issue_report.toLowerCase().includes(search.toLowerCase()) ||
        item.automation.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching from:", process.env.NEXT_PUBLIC_BACKEND_DOMAIN);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances`, {
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
        };
    
        fetchData();
    }, []);

    return (
    <>
        <div className="font-bold text-2xl mb-5">Maintenance Tracker</div>
        <Input
            placeholder="Search by issue or automation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md mb-5"
        />
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Automation</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((item) => (
                <TableRow key={item.maintenance_id}>
                    <TableCell>{item.maintenance_id}</TableCell>
                    <TableCell>{item.issue_report}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.automation.name}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
    );
}
