"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Proportions } from "lucide-react";
import { Automation } from "@/type/automation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditAutomationForm } from "./AutomationEditForm";
import Link from "next/link";
import { deleteAutomation } from "@/app/automations/action";
import {useUser} from "@clerk/nextjs";
import {RoleType} from "@/type/role";

interface AutomationTableProps {
  automationsData: Automation[];
}

export function AutomationTable({ automationsData }: AutomationTableProps) {
  const [automations, setAutomations] = useState(automationsData);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(
      null
  );
  const { user } = useUser();
  const role = user?.organizationMemberships[0]?.role;
  const isAuthorized = role === RoleType.PLANNER || role === RoleType.ADMIN;

  const handleDelete = async (id: string) => {
    if (!isAuthorized) return;
    const success = await deleteAutomation(id);
    if (success) {
      setAutomations((prev) =>
          prev.filter((automation) => automation.automation_id !== id)
      );
    }
  };

  const handleAutomationUpdated = (updatedAutomation: Automation) => {
    setAutomations((prev) =>
        prev.map((automation) =>
            automation.automation_id === updatedAutomation.automation_id
                ? updatedAutomation
                : automation
        )
    );
  };

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
              <TableCell className="font-medium">
                <Link
                  href={`/maintenance/get-all-by-automation-id/${automation.automation_id}`}
                >
                  {automation.automation_id}
                </Link>
              </TableCell>
              <TableCell>{automation.name}</TableCell>
              <TableCell>{automation.description}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    automation.status === "active" ? "default" : "secondary"
                  }
                >
                  {automation.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(automation.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(automation.updated_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingAutomation(automation)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(automation.automation_id)}
                    >
                      <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/report/${automation.automation_id}`}>
                        <Proportions className="mr-2 h-4 w-4" /> View Report
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

        {/* Edit Dialog */}
        {editingAutomation && (
            <Dialog
                open={!!editingAutomation}
                onOpenChange={() => setEditingAutomation(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Automation</DialogTitle>
                </DialogHeader>
                <EditAutomationForm
                    automation={editingAutomation}
                    onAutomationUpdated={handleAutomationUpdated}
                    onClose={() => setEditingAutomation(null)}
                />
              </DialogContent>
            </Dialog>
        )}
      </div>
  );
}
