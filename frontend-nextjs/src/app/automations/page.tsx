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

export default function AutomationPage() {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, isLoading] = useState(true)

    useEffect(() => {
        async function fetchAutomations() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations`, {
                headers: { "Content-Type": "application/json" },
                method: "GET",
                credentials: "include",
            });
            const automationData: Automation[] = await response.json();
            setAutomations(automationData);
            isLoading(false)
        }
        

        fetchAutomations();
    }, []);

    const handleAutomationCreated = (newAutomation: Automation) => {
        setAutomations((prev) => [...prev, newAutomation]);
    };

    if (loading) {
        return <div>Loading automations...</div>
    }

    return (
        <div>
            <div className="text-xl font-bold">Automations management</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"default"}>
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
        </div>
    );
}
