import {AutomationTable} from "@/components/automation-page/AutomationTable";
import {CreateAutomationForm} from "@/components/automation-page/AutomationCreateForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {CirclePlus} from "lucide-react";
import {Automation} from "@/type/automation";


export default async function AutomationPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations`, {
        headers: {"Content-Type": "application/json"},
        method: "GET",
        credentials: "include",
    });
    const automationData: Automation[] = await response.json();

    return (
        <div>
            <div className="text-xl font-bold">Automations management</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'default'}>
                        Adding Automation
                        <CirclePlus />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Form add create automation</DialogTitle>
                        <DialogDescription>Complete form to add new automation</DialogDescription>
                    </DialogHeader>
                    <CreateAutomationForm/>
                </DialogContent>
            </Dialog>
            <AutomationTable automationsData={automationData} />
        </div>
    )
}