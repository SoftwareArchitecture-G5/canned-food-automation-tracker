"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, {useCallback, useState} from "react";
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
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Check, ChevronsUpDown} from "lucide-react"
import {cn} from "@/lib/utils"

interface Props {
    initialNodes: Node[];
    initialEdges: Edge[];
    onAutomationUsed: (automationId: string) => void;
    onAutomationRemoved: (automationId: string) => void;
}

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

export default function BlueprintEditor({initialNodes, initialEdges, onAutomationUsed, onAutomationRemoved}: Props) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialEdges || []);
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

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
            data: {label: automation.name},
        };

        setNodes((prev) => [...prev, newNode]);
        onAutomationUsed(automation.automation_id); // แจ้งว่า automation ถูกใช้
    };

    const removeNode = (nodeId: string) => {
        setNodes((prev) => prev.filter((node) => node.id !== nodeId));
        onAutomationRemoved(nodeId); // แจ้งว่า automation ถูกนำออก
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-full p-4"
        >
            <div>
                <div className="flex gap-4">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {value
                                    ? frameworks.find((framework) => framework.value === value)?.label
                                    : "Select a blueprint..."}
                                <ChevronsUpDown className="opacity-50"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search Blueprint" className="h-9"/>
                                <CommandList>
                                    <CommandEmpty>No Blueprint found.</CommandEmpty>
                                    <CommandGroup>
                                        {frameworks.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                {framework.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button onClick={() => console.log("Save Blueprint")}>Save</Button>
                    <Button variant={"outline"} onClick={() => console.log("Save Blueprint")}>Create New</Button>
                </div>
                <div className="my-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>
                                Remove
                                <Trash2/>
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
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background/>
            </ReactFlow>

        </div>
    );
}
