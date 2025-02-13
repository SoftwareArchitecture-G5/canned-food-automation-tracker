"use client"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Maintenance } from "@/type/maintenance";


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

    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault(); // Prevent default form submission (redirect)
    
    //     const formData = new FormData(event.target as HTMLFormElement);
    
    //     const response = await fetch('http://localhost:8000/maintenances/', {
    //       method: 'POST',
    //       body: formData,
    //     });
    
    //     if (response.ok) {
    //       const result = await response.json();
    //       alert('Maintenance created successfully!');
    //       // Optionally, handle the response (e.g., reset form, show a success message)
    //     } else {
    //       alert('Error creating maintenance!');
    //     }
    // };

    return (
    <>
    {/* Form */}
    {/* <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <Label htmlFor="issue_report">Issue</Label>
        <Input id="issue_report" name="issue_report" type="text" required />
        </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" required />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
          <SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>

      <div>
        <Label htmlFor="automation_id">Automation</Label>
        <Select id="automation_id" name="automation_id" required>
          <SelectTrigger>
            <SelectContent>
              <SelectItem value="b2e8d2f5-b86b-4611-80eb-29fef7192675">Automation 2</SelectItem>
              <SelectItem value="5bcdff1a-51b1-4ac5-b6c9-9941a34fc2ac">Automation 5</SelectItem>
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>

      <Button type="submit">Create Maintenance</Button>
    </form> */}

    {/* Table */}
        {automationId}
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
                    <TableHead>Maintenance ID</TableHead>
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
