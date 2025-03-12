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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    initialNodes: Node[];
    initialEdges: Edge[];
}

export default function BlueprintEditor({ initialNodes, initialEdges }: Props) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialEdges || []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [blueprintName, setBlueprintName] = useState("");

    const { setNodeRef } = useDroppable({ id: "blueprint-dropzone" });

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
        if (!nodes) return;

        const automationType = event.dataTransfer.getData("automationType");
        if (!automationType) return;

        const dropZoneRect = event.currentTarget.getBoundingClientRect();
        const position = {
            x: event.clientX - dropZoneRect.left,
            y: event.clientY - dropZoneRect.top,
        };

        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: "default",
            position,
            data: { label: automationType },
        };

        setNodes((prev) => [...prev, newNode]);
    };

    const handleSave = async () => {
        if (!blueprintName) {
            alert("Please enter a blueprint name!");
            return;
        }

        const blueprintData = { name: blueprintName, nodes, edges };
        console.log(blueprintData);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/blueprint/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blueprintData),
            });

            alert("Blueprint saved!");
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving blueprint:", error);
        }
    };

    return (
        <div
            ref={setNodeRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-full p-4"
        >
            <Button onClick={() => setIsDialogOpen(true)}>Save</Button>

            {/* ShadCN Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Blueprint</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <Label htmlFor="blueprintName">Blueprint Name</Label>
                        <Input
                            id="blueprintName"
                            value={blueprintName}
                            onChange={(e) => setBlueprintName(e.target.value)}
                            placeholder="Enter blueprint name..."
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
