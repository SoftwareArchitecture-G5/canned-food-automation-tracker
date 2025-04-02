import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Maintenance, MaintenanceStatus } from "@/type/maintenance";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RoleType } from "@/type/role";
import {updateMaintenance} from "@/app/maintenance/get-all-by-automation-id/[automationId]/action";


export default function MaintenanceEditDialog({ maintenanceData } : { maintenanceData: Maintenance }) {
    const statusOptions = Object.values(MaintenanceStatus);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState(maintenanceData?.status);
    const { user } = useUser()
    const role = user?.organizationMemberships[0].role
    const isAuthorized = role === RoleType.ENGINEER || RoleType.ADMIN;

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!maintenanceData) return;

        const formData = new FormData(event.target as HTMLFormElement);
        const updatedMaintenance = {
            issue_report: formData.get("issue_report"),
            date: formData.get("date"),
            status,
        };

        try {
            await updateMaintenance(maintenanceData.maintenance_id, updatedMaintenance);
            setIsOpen(false); // Close the dialog
        } catch (error) {
            console.error("Error updating maintenance:", error);
        }
    };

    return (
        <div>
            <Button
                variant="outline"
                className="mr-2"
                onClick={() => setIsOpen(true)}
                disabled={!isAuthorized}
            >
                Edit Maintenance
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogTitle>Edit Maintenance</DialogTitle>
                    <form onSubmit={handleUpdate}>
                        {/* Issue Report */}
                        <div>
                            <Label htmlFor="issue_report">Issue Report</Label>
                            <Input
                                id="issue_report"
                                name="issue_report"
                                type="text"
                                required
                                defaultValue={maintenanceData?.issue_report || ""}
                            />
                        </div>
                        {/* Date */}
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                required
                                defaultValue={maintenanceData?.date || ""}
                            />
                        </div>
                        {/* Status */}
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={maintenanceData?.status || "pending"} required
                                    onValueChange={(status) => setStatus(status as MaintenanceStatus)}>
                                <SelectTrigger>
                                    {status}
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Update Maintenance</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}