"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchBlueprintData } from "@/app/blueprinnt/action";
import AutomationPanel from "@/components/blueprint-page/AutomationPanel";

const BlueprintEditor = dynamic(() => import("@/components/blueprint-page/BlueprintEditor"), {
    ssr: false,
});

export default function BlueprintPage() {
    const [blueprintData, setBlueprintData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
    const [automations, setAutomations] = useState<{ automation_id: string; name: string }[]>([]);
    const [usedAutomations, setUsedAutomations] = useState<string[]>([]); // State สำหรับเก็บ automation ที่ถูกใช้ไปแล้ว
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlueprint = async () => {
            try {
                const data = await fetchBlueprintData();
                setBlueprintData(data[0] || { nodes: [], edges: [] });

                // Fetch automation list
                const automationResponse = await fetch("http://localhost:8000/automations");
                const automationData = await automationResponse.json();
                setAutomations(automationData);
            } catch (error) {
                console.error("Error fetching blueprint data:", error);
            }
            setLoading(false);
        };

        loadBlueprint();
    }, []);

    const handleAutomationUsed = (automationId: string) => {
        setUsedAutomations((prev) => [...prev, automationId]);
    };

    const handleAutomationRemoved = (automationId: string) => {
        setUsedAutomations((prev) => prev.filter((id) => id !== automationId));
    };

    if (loading) return <div>Loading ...</div>;

    return (
        <div className="flex h-screen">
            <AutomationPanel
                automations={automations.filter((a) => !usedAutomations.includes(a.automation_id))}
            />
            <BlueprintEditor
                initialEdges={blueprintData.edges}
                initialNodes={blueprintData.nodes}
                onAutomationUsed={handleAutomationUsed}
                onAutomationRemoved={handleAutomationRemoved}
            />
        </div>
    );
}
