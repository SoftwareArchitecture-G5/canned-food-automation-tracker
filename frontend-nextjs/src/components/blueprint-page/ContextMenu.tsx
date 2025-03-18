import React, { useRef, useEffect } from "react";
import { Edit, Copy, Trash, ArrowUpDown } from "lucide-react";

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
    useEffect(() => {
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

export default ContextMenu;