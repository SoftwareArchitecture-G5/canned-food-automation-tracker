"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Edge,
    Node,
    Connection,
    NodeChange,
    EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDroppable } from "@dnd-kit/core";

const initialNodes: Node[] = [
    {
        id: "1",
        type: "input",
        position: { x: 250, y: 5 },
        data: { label: "Start" },
    },
];

const initialEdges: Edge[] = [];

export default function BlueprintEditor() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const { setNodeRef } = useDroppable({
        id: "blueprint-dropzone",
    });

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const automationType = event.dataTransfer.getData("automationType");

        if (!automationType) return;

        const dropZoneRect = event.currentTarget.getBoundingClientRect();
        const position = {
            x: event.clientX - dropZoneRect.left, // คำนวณพิกัดภายใน Blueprint
            y: event.clientY - dropZoneRect.top,
        };

        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: "default",
            position, // ใช้พิกัดที่คำนวณใหม่
            data: { label: automationType },
        };

        setNodes((prev) => [...prev, newNode]);
    };

    const handleSave = async () => {
        const blueprintData = { nodes, edges };

        try {
            await fetch("/api/save-blueprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blueprintData),
            });
            alert("Blueprint saved!");
        } catch (error) {
            console.error("Error saving blueprint:", error);
        }
    };

    return (
        <div
            ref={setNodeRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-full"
        >
            <button onClick={handleSave} className="p-2 bg-blue-500 text-white">
                Save Blueprint
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    );
}
