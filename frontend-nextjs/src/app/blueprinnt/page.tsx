"use client";
import dynamic from "next/dynamic";
import AutomationPanel from "@/components/blueprint-page/AutomationPanel";
import { useEffect, useState } from "react";
import { fetchBlueprintData } from "@/app/blueprinnt/action";

const BlueprintEditor = dynamic(() => import("@/components/blueprint-page/BlueprintEditor"), {
    ssr: false,
});

export default function BlueprintPage() {
    const [blueprintData, setBlueprintData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlueprint = async () => {
            try {
                const data = await fetchBlueprintData();
                setBlueprintData(data);
            } catch (error) {
                console.error("Error fetching blueprint data:", error);
            }
            setLoading(false);
        };

        loadBlueprint();
    }, []);

    console.log(blueprintData)
    if (loading) {
        return <div>Loading ...</div>;
    }
    return (
        <div className="flex h-screen">
            <AutomationPanel />
            <BlueprintEditor initialEdges={blueprintData[0].edges} initialNodes={blueprintData[0].nodes} />
        </div>
    );
}
