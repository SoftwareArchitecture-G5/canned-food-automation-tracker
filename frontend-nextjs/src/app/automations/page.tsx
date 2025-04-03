"use client"

import { AutomationTable } from "@/components/automation-page/AutomationTable";
import { CreateAutomationForm } from "@/components/automation-page/AutomationCreateForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Automation } from "@/type/automation";
import { useState, useEffect } from "react";
import { getAutomations } from "./action";
import {useUser} from "@clerk/nextjs";
import {RoleType} from "@/type/role";

export default function AutomationPage() {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const { user } = useUser()
    const role = user?.organizationMemberships[0].role
    const isAuthorized = role === RoleType.PLANNER || role === RoleType.ADMIN;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const result = await getAutomations(currentPage, limit);
                setAutomations(result.data);
                setTotal(result.total);
            } catch (error) {
                console.error("Error loading automations", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [currentPage]);

    const handleAutomationCreated = (newAutomation: Automation) => {
        setAutomations((prev) => [newAutomation, ...prev]);
        setTotal((prev) => prev + 1);
    };

    const totalPages = Math.ceil(total / limit);

    if (loading) {
        return <div>Loading automations...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="text-xl font-bold">Automations management</div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"default"} disabled={!isAuthorized}>
                        Adding Automation
                        <CirclePlus />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Form add create automation</DialogTitle>
                        <DialogDescription>Complete form to add new automation</DialogDescription>
                    </DialogHeader>
                    <CreateAutomationForm onAutomationCreated={handleAutomationCreated} />
                </DialogContent>
            </Dialog>

            <AutomationTable automationsData={automations} />

            {/* Pagination controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
