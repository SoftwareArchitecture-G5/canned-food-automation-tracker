"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronsUpDown, Check } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Blueprint } from "@/type/blueprint";
import { Node } from "reactflow";

interface BlueprintControlsProps {
    blueprints: Blueprint[];
    nodes: Node[];
    selectedBlueprintId: string;
    onSave: () => void;
    onCreateNew: () => void;
    onDelete: () => void;
    onRemoveNode: (nodeId: string) => void;
    onBlueprintSelect: (blueprintId: string) => void;
}

const BlueprintControls = ({
                               blueprints,
                               nodes,
                               selectedBlueprintId,
                               onSave,
                               onCreateNew,
                               onDelete,
                               onRemoveNode,
                               onBlueprintSelect,
                           }: BlueprintControlsProps) => {
    const [open, setOpen] = React.useState(false);

    const selectedBlueprintName = selectedBlueprintId
        ? blueprints.find((blueprint) => blueprint.blueprint_id === selectedBlueprintId)?.name || "Select a blueprint..."
        : "Select a blueprint...";

    return (
        <div className="flex gap-4 mb-8 justify-between items-center">
            {/* Blueprint selection */}
            <div className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {selectedBlueprintName}
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
                                                onBlueprintSelect(blueprint.blueprint_id);
                                                setOpen(false);
                                            }}
                                        >
                                            {blueprint.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    selectedBlueprintId === blueprint.blueprint_id ? "opacity-100" : "opacity-0"
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
                <Button
                    onClick={onSave}
                    disabled={!selectedBlueprintId}
                    title={!selectedBlueprintId ? "Select a blueprint first" : "Save blueprint"}
                >
                    Save
                </Button>
                <Button onClick={onCreateNew}>Create New</Button>
                <Button
                    onClick={onDelete}
                    variant={"destructive"}
                    disabled={!selectedBlueprintId}
                    title={!selectedBlueprintId ? "Select a blueprint first" : "Delete blueprint"}
                >
                    Delete
                </Button>
            </div>

            {/* Dropdown to remove nodes */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} disabled={nodes.length === 0}>
                        Remove Automation In Flow
                        <Trash2 className="ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {nodes.length === 0 ? (
                        <DropdownMenuItem disabled>No nodes to remove</DropdownMenuItem>
                    ) : (
                        nodes.map((node) => (
                            <DropdownMenuItem key={node.id} onClick={() => onRemoveNode(node.id)}>
                                Remove {node.data.label}
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default BlueprintControls;