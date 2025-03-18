"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchBlueprintData } from "@/app/blueprint/action";
import AutomationPanel from "@/components/blueprint-page/AutomationPanel";
import { Blueprint } from "@/type/blueprint";

const BlueprintEditor = dynamic(() => import("@/components/blueprint-page/BlueprintEditor"), {
    ssr: false,
});

export default function BlueprintPage() {
    const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
    const [currentBlueprint, setCurrentBlueprint] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
    const [automations, setAutomations] = useState<{ automation_id: string; name: string }[]>([]);
    const [usedAutomations, setUsedAutomations] = useState<string[]>([]); // State for used automations
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadBlueprint = async () => {
            try {
                const data: Blueprint[] = await fetchBlueprintData();

                setBlueprints(data);

                const latestBlueprint = data.reduce((latest, current) =>
                        current.created_at > latest.created_at ? current : latest
                    , data[0]) || { nodes: [], edges: [] };

                setCurrentBlueprint(latestBlueprint);

                // Fetch automation list
                const automationResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations`);
                const automationData = await automationResponse.json();
                setAutomations(automationData);

                // Check if any automations are already used in the blueprint
                const usedIds = latestBlueprint.nodes.map(node => node.id);
                setUsedAutomations(usedIds);

            } catch (error) {
                console.error("Error fetching blueprint data:", error);
            }
            setLoading(false);
        };

        loadBlueprint();
    }, []);

    // Update used automations when a blueprint is selected
    const handleBlueprintSelect = (blueprintId: string) => {
        const blueprint = blueprints.find(b => b.blueprint_id === blueprintId);
        if (blueprint) {
            const usedIds = blueprint.nodes.map(node => node.id);
            setUsedAutomations(usedIds);  // Set the used automations for the selected blueprint
            setCurrentBlueprint({ nodes: blueprint.nodes, edges: blueprint.edges });
        }
    };

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
                automations={automations.filter(a => !usedAutomations.includes(a.automation_id))}
            />
            <BlueprintEditor
                initialEdges={currentBlueprint.edges}
                initialNodes={currentBlueprint.nodes}
                onAutomationUsed={handleAutomationUsed}
                onAutomationRemoved={handleAutomationRemoved}
                blueprints={blueprints}
                onBlueprintSelect={handleBlueprintSelect} // Pass the handler to sync the blueprint
            />
        </div>
    );
}
