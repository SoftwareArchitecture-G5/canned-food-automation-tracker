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
import {Automation} from "@/type/automation";

interface AutomationTableProps {
    automationsData: Automation[];
}

export function AutomationTable({automationsData}: AutomationTableProps) {
    const [automations, setAutomations] = useState(automationsData)

    console.log(automations)
    return (
        <div className="container mx-auto py-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Updated Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {automations.map((automation) => (
                        <TableRow key={automation.automation_id}>
                            <TableCell className="font-medium">{automation.automation_id}</TableCell>
                            <TableCell>{automation.name}</TableCell>
                            <TableCell>{automation.description}</TableCell>
                            <TableCell>
                                <Badge variant={automation.status === "active" ? "default" : "secondary"}>{automation.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(automation.created_at).toLocaleString()}</TableCell>
                            <TableCell>{new Date(automation.updated_at).toLocaleString()}</TableCell>
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

