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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Blueprint } from "@/type/blueprint";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

interface Props {
    initialNodes: Node[];
    initialEdges: Edge[];
    onAutomationUsed: (automationId: string) => void;
    onAutomationRemoved: (automationId: string) => void;
    blueprints: Blueprint[];
    onBlueprintSelect: (blueprintId: string) => void; // New prop for blueprint selection
}

export default function BlueprintEditor({
                                            initialNodes,
                                            initialEdges,
                                            onAutomationUsed,
                                            onAutomationRemoved,
                                            blueprints,
                                            onBlueprintSelect,
                                        }: Props) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialEdges || []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [blueprintName, setBlueprintName] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

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

        const automationData = event.dataTransfer.getData("automation");
        if (!automationData) return;

        const automation = JSON.parse(automationData);

        const dropZoneRect = event.currentTarget.getBoundingClientRect();
        const position = {
            x: event.clientX - dropZoneRect.left,
            y: event.clientY - dropZoneRect.top,
        };

        const newNode: Node = {
            id: automation.automation_id,
            type: "default",
            position,
            data: { label: automation.name },
        };

        setNodes((prev) => [...prev, newNode]);
        onAutomationUsed(automation.automation_id); // Notify automation is used
    };

    const removeNode = (nodeId: string) => {
        setNodes((prev) => prev.filter((node) => node.id !== nodeId));
        onAutomationRemoved(nodeId); // Notify automation is removed
    };

    const onNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            deletedNodes.forEach((node) => {
                onAutomationRemoved(node.id);
            });
        },
        [onAutomationRemoved]
    );

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
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-4/5 mx-6"
        >
            <div>
                <div className="flex gap-4 mb-8">
                    {/* Blueprint selection */}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {value
                                    ? blueprints.find((blueprint) => blueprint.blueprint_id === value)?.name || "Select a blueprint..."
                                    : "Select a blueprint..."}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search Blueprint" className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No Blueprint found.</CommandEmpty>
                                    <CommandGroup>
                                        {blueprints.map((blueprint) => (
                                            <CommandItem
                                                key={blueprint.blueprint_id}
                                                value={blueprint.blueprint_id}
                                                onSelect={() => {
                                                    setValue(blueprint.blueprint_id);
                                                    setNodes(blueprint.nodes);
                                                    setEdges(blueprint.edges);
                                                    onBlueprintSelect(blueprint.blueprint_id);
                                                    setOpen(false);
                                                }}
                                            >
                                                {blueprint.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === blueprint.blueprint_id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {/* Save and Create New buttons */}
                    <Button onClick={() => console.log(value)}>Save</Button>
                    <Button onClick={() => setIsDialogOpen(true)}>Create New</Button>

                    {/* Dialog for saving blueprint */}
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

                    {/* Dropdown to remove nodes */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>
                                Remove
                                <Trash2 />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {nodes.map((node) => (
                                <DropdownMenuItem key={node.id} onClick={() => removeNode(node.id)}>
                                    Remove {node.data.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ReactFlow component for visualizing nodes and edges */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodesDelete={onNodesDelete}
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    );
}
