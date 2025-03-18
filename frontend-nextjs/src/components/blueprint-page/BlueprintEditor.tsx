"use client";

import React from "react";
import { Edge, Node, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { Blueprint } from "@/type/blueprint";
import FlowEditor from "./FlowEditor";

interface BlueprintEditorProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    onAutomationUsed: (automationId: string) => void;
    onAutomationRemoved: (automationId: string) => void;
    blueprints: Blueprint[];
    onBlueprintSelect: (blueprintId: string) => void;
}

// Main component that wraps the editor with ReactFlowProvider
export default function BlueprintEditor({
                                            initialNodes,
                                            initialEdges,
                                            onAutomationUsed,
                                            onAutomationRemoved,
                                            blueprints,
                                            onBlueprintSelect
                                        }: BlueprintEditorProps) {
    return (
        <ReactFlowProvider>
            <FlowEditor
                initialNodes={initialNodes}
                initialEdges={initialEdges}
                onAutomationUsed={onAutomationUsed}
                onAutomationRemoved={onAutomationRemoved}
                blueprints={blueprints}
                onBlueprintSelect={onBlueprintSelect}
            />
        </ReactFlowProvider>
    );
}