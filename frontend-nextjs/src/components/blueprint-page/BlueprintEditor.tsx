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
    // Transform initialEdges to have the animated type if provided
    const animatedInitialEdges = initialEdges?.map(edge => ({
        ...edge,
        type: 'animated',
        animated: true,
    })) || [];

    return (
        <ReactFlowProvider>
            <FlowEditor
                initialNodes={initialNodes}
                initialEdges={animatedInitialEdges}
                onAutomationUsed={onAutomationUsed}
                onAutomationRemoved={onAutomationRemoved}
                blueprints={blueprints}
                onBlueprintSelect={onBlueprintSelect}
            />
        </ReactFlowProvider>
    );
}