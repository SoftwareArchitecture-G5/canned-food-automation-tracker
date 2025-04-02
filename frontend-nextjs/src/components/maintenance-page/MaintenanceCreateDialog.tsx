import { Dialog, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RoleType } from "@/type/role";
import {createMaintenance} from "@/app/maintenance/get-all-by-automation-id/[automationId]/action";


export default function MaintenanceCreateDialog({ automationId } : { automationId: string | null }) {
    const [isOpen, setIsOpen] = useState(false); // Dialog visibility
    const { user } = useUser()
    const role = user?.organizationMemberships[0]?.role;
    const isAuthorized = role === RoleType.ENGINEER || RoleType.ADMIN;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const newMaintenance = {
            issue_report: formData.get("issue_report"),
            date: formData.get("date"),
            status: "pending",
            automation_id: automationId,
        };

        const data = await createMaintenance(newMaintenance);
        if (data) {
            console.log("Maintenance created:", data);
            setIsOpen(false); // Close the dialog
        }

        console.log("Form submitted");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={!isAuthorized}>Create Maintenance</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Maintenance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="issue_report">Issue</Label>
                        <Input id="issue_report" name="issue_report" type="text" required />
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Submit</Button>
                        <DialogClose asChild>
                            <Button variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
