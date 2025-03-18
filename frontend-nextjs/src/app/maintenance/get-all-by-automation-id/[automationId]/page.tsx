"use client"
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {Select, SelectItem, SelectTrigger, SelectContent} from "@/components/ui/select";
import {Maintenance} from "@/type/maintenance";


export default function MaintenancePage({params}: { params: Promise<{ automationId: string }> }) {
    const [search, setSearch] = useState("");
    const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
    const [automationId, setAutomationId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Maintenance | null>(null); // Data for editing
    const [isOpen, setIsOpen] = useState(false); // Dialog visibility

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
                        headers: {"Content-Type": "application/json"},
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const issueReport = formData.get("issue_report") as string;
        const date = formData.get("date") as string;

        const newMaintenance = {
            issue_report: issueReport,
            date: date,
            status: "pending",
            automation_id: automationId,
        };

        const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/`;
        try {
            const response = await fetch(url, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                credentials: "include",
                body: JSON.stringify(newMaintenance),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Maintenance created:", data);
            setIsOpen(false); // Close the dialog
        } catch (error) {
            console.error("Error creating maintenance:", error);
        }

        console.log("Form submitted");
    };

    const handleDelete = async (maintenanceId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this maintenance?");
        if (confirmDelete) {
            try {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/${maintenanceId}`;
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                setMaintenanceData(maintenanceData.filter(item => item.maintenance_id !== maintenanceId)); // Remove item from the state
            } catch (error) {
                console.error("Error deleting maintenance:", error);
            }
        }
    };

    const handleEdit = (item: Maintenance) => {
        setEditData(item); // Set item data for editing
        setIsOpen(true); // Open dialog
    };

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const issueReport = formData.get("issue_report") as string;
        const date = formData.get("date") as string;
        const status = formData.get("status") as string;

        const updatedMaintenance = {
            issue_report: issueReport,
            date: date,
            status: status,
        };

        const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/maintenances/${editData?.maintenance_id}`;

        try {
            const response = await fetch(url, {
                headers: {"Content-Type": "application/json"},
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify(updatedMaintenance),
            });

            console.log(JSON.stringify(updatedMaintenance))
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Maintenance updated:", data);
            setIsOpen(false); // Close the dialog
        } catch (error) {
            console.error("Error updating maintenance:", error);
        }
    };

    return (
        <div>

            {/* Table */}
            {/* {automationId} */}
            <div className="font-bold text-2xl mb-5">Maintenance Tracker</div>
            <Input
                placeholder="Search by issue or automation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md mb-5"
            />
            {/* Create dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create Maintenance</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Maintenance</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="issue_report">Issue</Label>
                            <Input id="issue_report" name="issue_report" type="text" required/>
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" required/>
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
                    {filteredData.map((item) => (
                        <TableRow key={item.maintenance_id}>
                            <TableCell>{item.maintenance_id}</TableCell>
                            <TableCell>{item.issue_report}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.automation.name}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleEdit(item)}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    Edit
                                </Button>

                                {/* Dialog for editing */}
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
                                                    defaultValue={editData?.issue_report || ""}
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
                                                    defaultValue={editData?.date || ""}
                                                />
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <Label htmlFor="status">Status</Label>
                                                <Select name="status"
                                                        defaultValue={editData?.status || "pending"} required>
                                                    <SelectTrigger>
                                                        {editData?.status || "pending"}
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                        </SelectContent>
                                                    </SelectTrigger>
                                                </Select>
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit">Update Maintenance</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    onClick={() => handleDelete(item.maintenance_id)}
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
