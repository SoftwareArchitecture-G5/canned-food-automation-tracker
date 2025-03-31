"use client"

import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SaveBlueprintDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    blueprintName: string;
    onBlueprintNameChange: (name: string) => void;
    onSave: () => void;
}

export const SaveBlueprintDialog = ({
                                        isOpen,
                                        onOpenChange,
                                        blueprintName,
                                        onBlueprintNameChange,
                                        onSave,
                                    }: SaveBlueprintDialogProps) => {
    const handleSave = () => {
        if (!blueprintName.trim()) {
            alert("Please enter a blueprint name");
            return;
        }
        onSave();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save Blueprint</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="blueprintName">Blueprint Name</Label>
                    <Input
                        id="blueprintName"
                        value={blueprintName}
                        onChange={(e) => onBlueprintNameChange(e.target.value)}
                        placeholder="Enter blueprint name..."
                        autoFocus
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
    );
};

interface EditNodeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    nodeLabel: string;
    onNodeLabelChange: (label: string) => void;
    onSave: () => void;
}

export const EditNodeDialog = ({
                                   isOpen,
                                   onOpenChange,
                                   nodeLabel,
                                   onNodeLabelChange,
                                   onSave,
                               }: EditNodeDialogProps) => {
    const handleSave = () => {
        if (!nodeLabel.trim()) {
            alert("Node label cannot be empty");
            return;
        }
        onSave();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Node</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="nodeLabel">Node Label</Label>
                    <Input
                        id="nodeLabel"
                        value={nodeLabel}
                        onChange={(e) => onNodeLabelChange(e.target.value)}
                        placeholder="Enter node label..."
                        autoFocus
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
    );
};