"use client"

import React, { useCallback, useState, useEffect } from "react";
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
    NodeMouseHandler,
    Controls,
    EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import "./animatedEdge.css"; // Import the animation CSS
import { Blueprint } from "@/type/blueprint";
import ResizableNode from "./ResizableNode";
import AnimatedSVGEdge from "./AnimatedSVGEdge"; // Import the new edge component
import ContextMenu from "./ContextMenu";
import BlueprintControls from "./BlueprintControls";
import { SaveBlueprintDialog, EditNodeDialog } from "./BlueprintDialogs";
import { useRouter } from 'next/navigation'
import LoadingSpinner from "./LoadingSpinner";
import {deleteBlueprint, saveBlueprint, saveExistingBlueprint} from "@/app/blueprint/action";

// Define the node types
const nodeTypes = {
    resizable: ResizableNode,
};

// Define the edge types
const edgeTypes: EdgeTypes = {
    animated: AnimatedSVGEdge,
};

interface FlowEditorProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    onAutomationUsed: (automationId: string) => void;
    onAutomationRemoved: (automationId: string) => void;
    blueprints: Blueprint[];
    onBlueprintSelect: (blueprintId: string) => void;
}

const FlowEditor = ({
                        initialNodes,
                        initialEdges,
                        onAutomationUsed,
                        onAutomationRemoved,
                        blueprints,
                        onBlueprintSelect,
                    }: FlowEditorProps) => {
    const [nodes, setNodes] = useState<Node[]>(
        initialNodes?.map(node => ({
            ...node,
            type: 'resizable',
            style: { ...node.style, width: node.style?.width || 180, height: node.style?.height || 80 }
        })) || []
    );
    const [edges, setEdges] = useState<Edge[]>(
        initialEdges?.map(edge => ({
            ...edge,
            type: 'animated', // Apply the animated edge type to all edges
            animated: true,
        })) || []
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [blueprintName, setBlueprintName] = useState("");
    const [selectedBlueprintId, setSelectedBlueprintId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const router = useRouter()

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

    // Effect to handle refreshing after operations complete
    useEffect(() => {
        if (needsRefresh && !isLoading) {
            // Force a hard refresh of the page
            window.location.reload();
        }
    }, [needsRefresh, isLoading]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            // Add the animated type to new connections
            const newEdge = {
                ...connection,
                type: 'animated',
                animated: true,
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
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
        try {
            setIsLoading(true);
            const message = await saveBlueprint(blueprintName, nodes, edges);
            alert(message);
            setIsDialogOpen(false);
            setNeedsRefresh(true);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveExisting = async () => {
        try {
            setIsLoading(true);
            const message = await saveExistingBlueprint(selectedBlueprintId, nodes, edges);
            alert(message);
            setNeedsRefresh(true);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this blueprint?")) return;

        try {
            setIsLoading(true);
            const message = await deleteBlueprint(selectedBlueprintId);
            alert(message);
            setSelectedBlueprintId("");
            setNodes([]);
            setEdges([]);
            setNeedsRefresh(true);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
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

            // Apply animated edge type to all loaded edges
            const animatedEdges = selectedBlueprint.edges.map(edge => ({
                ...edge,
                type: 'animated',
                animated: true,
            }));

            setNodes(resizableNodes);
            setEdges(animatedEdges);
            setSelectedBlueprintId(blueprintId);
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

    // NEW: Handler for the maintenance option
    const handleMaintenanceView = () => {
        if (contextMenu) {
            const nodeId = contextMenu.nodeId;
            const maintenanceUrl = `/maintenance/get-all-by-automation-id/${nodeId}`;
            router.push(maintenanceUrl);
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
    }, [contextMenu]);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-4/5 mx-6 relative"
        >
            {isLoading && <LoadingSpinner />}

            <BlueprintControls
                blueprints={blueprints}
                nodes={nodes}
                selectedBlueprintId={selectedBlueprintId}
                onSave={handleSaveExisting}
                onCreateNew={() => setIsDialogOpen(true)}
                onDelete={handleDelete}
                onRemoveNode={removeNode}
                onBlueprintSelect={handleLoadBlueprint}
            />

            {/* Save Blueprint Dialog */}
            <SaveBlueprintDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                blueprintName={blueprintName}
                onBlueprintNameChange={setBlueprintName}
                onSave={handleSave}
            />

            {/* Edit Node Dialog */}
            <EditNodeDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                nodeLabel={editNodeLabel}
                onNodeLabelChange={setEditNodeLabel}
                onSave={handleSaveNodeEdit}
            />

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
                    edgeTypes={edgeTypes}
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
                        onMaintenance={handleMaintenanceView}
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

export default FlowEditor;