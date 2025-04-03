import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Maintenance } from "@/type/maintenance";
import MaintenanceEditDialog from "@/components/maintenance-page/MaintenanceEditDialog";
import { useState } from "react";
import {useUser} from "@clerk/nextjs";
import {RoleType} from "@/type/role";
import {deleteMaintenance} from "@/app/maintenance/get-all-by-automation-id/[automationId]/action";

export default function MaintenanceTable({ data }: { data: Maintenance[] }) {
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const { user } = useUser()
    const role = user?.organizationMemberships[0].role
    const isAuthorized = role === RoleType.ENGINEER || role === RoleType.ADMIN;

    const handleDelete = async (maintenanceId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this maintenance?");
        if (confirmDelete) {
            try {
                await deleteMaintenance(maintenanceId);
                setMaintenanceData(maintenanceData.filter(item => item.maintenance_id !== maintenanceId));
            } catch (error) {
                console.error("Error deleting maintenance:", error);
            }
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Maintenance ID</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Automation</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.maintenance_id}>
                        <TableCell>{item.maintenance_id}</TableCell>
                        <TableCell>{item.issue_report}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.automation.name}</TableCell>
                        <TableCell style={{ display: "flex", alignItems: "center" }}>
                            <MaintenanceEditDialog maintenanceData={item}/>
                            <Button onClick={() => handleDelete(item.maintenance_id)} variant="destructive" disabled={!isAuthorized}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}