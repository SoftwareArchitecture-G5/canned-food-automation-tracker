"use client"
import React from "react";
import { NodeProps, NodeResizer, Handle, Position } from "reactflow";

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

export default ResizableNode;