"use client";

import React, { useCallback, useState, useRef } from "react";
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
    NodeProps,
    NodeResizer,
    Handle,
    Position,
    Controls,
    NodeMouseHandler,
    useReactFlow,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Copy, Trash, ArrowUpDown } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ContextMenuProps {
    nodeId: string;
    top: number;
    left: number;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onBringToFront: () => void;
}

const ContextMenu = ({
                         nodeId,
                         top,
                         left,
                         onClose,
                         onEdit,
                         onDelete,
                         onDuplicate,
                         onBringToFront,
                     }: ContextMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Click outside to close the menu
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the menu
            if (ref.current && !ref.current.contains(event.target as unknown as globalThis.Node)) {
                onClose();
            }
        };

        // Add event listener to document for all clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Add event listener for Escape key
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscapeKey);

        // Clean up event listeners when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onClose]);

    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                top,
                left,
                zIndex: 1000,
            }}
            className="bg-white rounded-md shadow-lg border border-gray-200 w-56 py-1"
        >
            <div className="px-2 py-1.5 text-sm font-semibold border-b border-gray-100 flex justify-between">
                <span>Node Options</span>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
            <div className="py-1">
                <button
                    onClick={onEdit}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                    <Edit className="w-4 h-4 mr-2" /> Edit Node
                </button>
                <button
                    onClick={onDuplicate}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                    <Copy className="w-4 h-4 mr-2" /> Duplicate
                </button>
                <button
                    onClick={onBringToFront}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                >
                    <ArrowUpDown className="w-4 h-4 mr-2" /> Bring to Front
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                    onClick={onDelete}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <Trash className="w-4 h-4 mr-2" /> Delete
                </button>
            </div>
        </div>
    );
};

// Improved resizable node component with context menu support
const ResizableNode = ({ id, data, selected }: NodeProps) => {
    return (
        <>
            {/* The outer div needs to take the full width and height of the node */}
            <div className="w-full h-full relative">
                {/* NodeResizer needs to be part of the DOM hierarchy */}
                <NodeResizer
                    minWidth={100}
                    minHeight={50}
                    isVisible={selected}
                    lineClassName="border-blue-500"
                    handleClassName="h-3 w-3 bg-blue-500 border border-white rounded"
                    // Allow full expansion in height
                    keepAspectRatio={false}
                />

                {/* Content container that fills all available space */}
                <div
                    className="absolute inset-0 border-2 rounded-md bg-white shadow-md flex flex-col"
                    data-nodeid={id} // Add data attribute for node identification
                >
                    <Handle
                        type="target"
                        position={Position.Top}
                        className="w-2 h-2 !bg-blue-400"
                    />

                    {/* Content that expands with the container */}
                    <div className="p-2 overflow-auto w-full h-full flex items-center justify-center">
                        {data.label}
                    </div>

                    <Handle
                        type="source"
                        position={Position.Bottom}
                        className="w-2 h-2 !bg-blue-400"
                    />
                </div>
            </div>
        </>
    );
};

// Define the node types
const nodeTypes = {
    resizable: ResizableNode,
};

// Flow Editor Component - Wraps the actual editor
const FlowEditor = ({
                        initialNodes,
                        initialEdges,
                        onAutomationUsed,
                        onAutomationRemoved,
                        blueprints,
                        onBlueprintSelect,
                    }: Props) => {
    const [nodes, setNodes] = useState<Node[]>(
        initialNodes?.map(node => ({
            ...node,
            type: 'resizable',
            style: { ...node.style, width: node.style?.width || 180, height: node.style?.height || 80 }
        })) || []
    );
    const [edges, setEdges] = useState<Edge[]>(initialEdges || []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [blueprintName, setBlueprintName] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    // Context menu state
    const [contextMenu, setContextMenu] = useState<{
        nodeId: string;
        top: number;
        left: number;
        visible: boolean;
    } | null>(null);

    // Edit node dialog state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editNodeId, setEditNodeId] = useState<string | null>(null);
    const [editNodeLabel, setEditNodeLabel] = useState("");

    const { getNode, setNodes: setFlowNodes } = useReactFlow();

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
            type: "resizable",
            position,
            data: { label: automation.name },
            style: { width: 180, height: 80 },
        };

        setNodes((prev) => [...prev, newNode]);
        onAutomationUsed(automation.automation_id);
    };

    const removeNode = (nodeId: string) => {
        setNodes((prev) => prev.filter((node) => node.id !== nodeId));
        onAutomationRemoved(nodeId);
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

    const handleLoadBlueprint = (blueprintId: string) => {
        const selectedBlueprint = blueprints.find(bp => bp.blueprint_id === blueprintId);
        if (selectedBlueprint) {
            const resizableNodes = selectedBlueprint.nodes.map(node => ({
                ...node,
                type: 'resizable',
                style: { ...node.style, width: node.style?.width || 180, height: node.style?.height || 80 }
            }));

            setNodes(resizableNodes);
            setEdges(selectedBlueprint.edges);
            onBlueprintSelect(blueprintId);
        }
    };

    // Context Menu Handlers
    const onNodeContextMenu: NodeMouseHandler = (event, node) => {
        // Prevent default context menu
        event.preventDefault();

        // Get the position for the context menu
        const rect = event.currentTarget.getBoundingClientRect();
        setContextMenu({
            nodeId: node.id,
            top: event.clientY - rect.top,
            left: event.clientX - rect.left,
            visible: true,
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    const handleEditNode = () => {
        if (contextMenu) {
            const node = nodes.find(n => n.id === contextMenu.nodeId);
            if (node) {
                setEditNodeId(node.id);
                setEditNodeLabel(node.data.label);
                setIsEditDialogOpen(true);
                closeContextMenu();
            }
        }
    };

    const handleDeleteNode = () => {
        if (contextMenu) {
            removeNode(contextMenu.nodeId);
            closeContextMenu();
        }
    };

    const handleDuplicateNode = () => {
        if (contextMenu) {
            const node = nodes.find(n => n.id === contextMenu.nodeId);
            if (node) {
                const newNode = {
                    ...node,
                    id: `${node.id}-copy-${Date.now()}`,
                    position: {
                        x: node.position.x + 20,
                        y: node.position.y + 20,
                    },
                };
                setNodes((prev) => [...prev, newNode]);
                closeContextMenu();
            }
        }
    };

    const handleBringToFront = () => {
        if (contextMenu) {
            // Bring the node to front by removing it and adding it back
            // This works because ReactFlow renders nodes in the order they appear in the array
            setNodes((nds) => {
                const nodeIndex = nds.findIndex(n => n.id === contextMenu.nodeId);
                if (nodeIndex !== -1) {
                    const node = nds[nodeIndex];
                    return [
                        ...nds.slice(0, nodeIndex),
                        ...nds.slice(nodeIndex + 1),
                        node,
                    ];
                }
                return nds;
            });
            closeContextMenu();
        }
    };

    const handleSaveNodeEdit = () => {
        if (editNodeId) {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === editNodeId
                        ? { ...node, data: { ...node.data, label: editNodeLabel } }
                        : node
                )
            );
            setIsEditDialogOpen(false);
            setEditNodeId(null);
            setEditNodeLabel("");
        }
    };

    // Prevent default browser context menu on the ReactFlow container
    const onPaneContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const onPaneClick = useCallback(() => {
        // Close context menu when clicking on the pane
        if (contextMenu) {
            closeContextMenu();
        }
    }, [contextMenu, closeContextMenu]);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-4/5 mx-6 relative"
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
                                                    handleLoadBlueprint(blueprint.blueprint_id);
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

                    {/* Dialog for editing node */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Node</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="nodeLabel">Node Label</Label>
                                <Input
                                    id="nodeLabel"
                                    value={editNodeLabel}
                                    onChange={(e) => setEditNodeLabel(e.target.value)}
                                    placeholder="Enter node label..."
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleSaveNodeEdit}>Save</Button>
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
            <div className="relative w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodesDelete={onNodesDelete}
                    nodeTypes={nodeTypes}
                    onNodeContextMenu={onNodeContextMenu}
                    onPaneContextMenu={onPaneContextMenu}
                    onPaneClick={onPaneClick}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>

                {/* Context Menu */}
                {contextMenu && contextMenu.visible && (
                    <ContextMenu
                        nodeId={contextMenu.nodeId}
                        top={contextMenu.top}
                        left={contextMenu.left}
                        onClose={closeContextMenu}
                        onEdit={handleEditNode}
                        onDelete={handleDeleteNode}
                        onDuplicate={handleDuplicateNode}
                        onBringToFront={handleBringToFront}
                    />
                )}
            </div>
        </div>
    );
};

interface Props {
    initialNodes: Node[];
    initialEdges: Edge[];
    onAutomationUsed: (automationId: string) => void;
    onAutomationRemoved: (automationId: string) => void;
    blueprints: Blueprint[];
    onBlueprintSelect: (blueprintId: string) => void;
}

// Main component that wraps the editor with ReactFlowProvider
export default function BlueprintEditor(props: Props) {
    return (
        <ReactFlowProvider>
            <FlowEditor {...props} />
        </ReactFlowProvider>
    );
}