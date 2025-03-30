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

export default function AutomationPage() {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, isLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const automationData = await getAutomations();
                setAutomations(automationData);
            } catch (error) {
                console.error("Error loading automations", error);
            } finally {
                isLoading(false);
            }
        }

        fetchData();
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
