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
    onRemoveNode: (nodeId: string) => void;
    onBlueprintSelect: (blueprintId: string) => void;
}

const BlueprintControls = ({
                               blueprints,
                               nodes,
                               selectedBlueprintId,
                               onSave,
                               onCreateNew,
                               onRemoveNode,
                               onBlueprintSelect,
                           }: BlueprintControlsProps) => {
    const [open, setOpen] = React.useState(false);

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
                            {selectedBlueprintId
                                ? blueprints.find((blueprint) => blueprint.blueprint_id === selectedBlueprintId)?.name || "Select a blueprint..."
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
                <Button onClick={onSave}>Save</Button>
                <Button onClick={onCreateNew}>Create New</Button>
            </div>

            {/* Dropdown to remove nodes */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"outline"}>
                        Remove Automation In Flow
                        <Trash2 />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {nodes.map((node) => (
                        <DropdownMenuItem key={node.id} onClick={() => onRemoveNode(node.id)}>
                            Remove {node.data.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default BlueprintControls;