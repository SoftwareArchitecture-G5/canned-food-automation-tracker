"use client"
import dynamic from "next/dynamic";
import AutomationPanel from "@/components/blueprint-page/AutomationPanel";

const BlueprintEditor = dynamic(() => import("@/components/blueprint-page/BlueprintEditor"), {
    ssr: false,
});

export default function Home() {
    return (
        <div className="flex h-screen">
            <AutomationPanel />
            <BlueprintEditor />
        </div>
    );
}
