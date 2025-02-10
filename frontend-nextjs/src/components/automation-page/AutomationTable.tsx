"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Play, Pause, MoreHorizontal } from "lucide-react"

// Sample data
const automations = [
    {
        id: "AUT001",
        name: "Daily Backup",
        description: "Performs daily backup of all systems",
        status: "Active",
        latestMaintenance: "2023-05-15",
        nextMaintenance: "2023-06-15",
    },
    {
        id: "AUT002",
        name: "Weekly Report",
        description: "Generates and sends weekly performance reports",
        status: "Inactive",
        latestMaintenance: "2023-05-10",
        nextMaintenance: "2023-05-17",
    },
    {
        id: "AUT003",
        name: "Error Monitoring",
        description: "Monitors systems for errors and sends alerts",
        status: "Active",
        latestMaintenance: "2023-05-12",
        nextMaintenance: "2023-06-12",
    },
]

export function AutomationTable() {
    const [automationData, setAutomationData] = useState(automations)

    const toggleStatus = (id: string) => {
        setAutomationData((prevData) =>
            prevData.map((automation) =>
                automation.id === id
                    ? {
                        ...automation,
                        status: automation.status === "Active" ? "Inactive" : "Active",
                    }
                    : automation,
            ),
        )
    }

    return (
        <div className="container mx-auto py-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Latest Maintenance</TableHead>
                        <TableHead>Next Maintenance</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {automationData.map((automation) => (
                        <TableRow key={automation.id}>
                            <TableCell className="font-medium">{automation.id}</TableCell>
                            <TableCell>{automation.name}</TableCell>
                            <TableCell>{automation.description}</TableCell>
                            <TableCell>
                                <Badge variant={automation.status === "Active" ? "default" : "secondary"}>{automation.status}</Badge>
                            </TableCell>
                            <TableCell>{automation.latestMaintenance}</TableCell>
                            <TableCell>{automation.nextMaintenance}</TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">More options</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Automation Actions</DialogTitle>
                                            <DialogDescription>Manage the automation "{automation.name}"</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-between items-center">
                                            <Button variant="outline" onClick={() => toggleStatus(automation.id)}>
                                                {automation.status === "Active" ? (
                                                    <>
                                                        <Pause className="mr-2 h-4 w-4" /> Pause
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="mr-2 h-4 w-4" /> Activate
                                                    </>
                                                )}
                                            </Button>
                                            <Button variant="default">Edit</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

