"use client";
import React from "react";
import { NodeProps, NodeResizer, Handle, Position } from "reactflow";

const ResizableNode = ({ id, data, selected }: NodeProps) => {
    return (
        <div className="w-full h-full relative">
            {/* Node Resizer */}
            <NodeResizer
                minWidth={100}
                minHeight={50}
                isVisible={selected}
                lineClassName="border-blue-500"
                handleClassName="h-4 w-4 bg-blue-500 border border-white rounded cursor-pointer"
                keepAspectRatio={false}
            />

            <div className="absolute inset-0 border-2 rounded-md bg-white shadow-md flex flex-col"
                 data-nodeid={id}
            >
                {/* Top handle */}
                <Handle
                    type="source"
                    position={Position.Top}
                    id={`${id}-top-source`}
                    className="w-3 h-3 !bg-blue-500 cursor-pointer"
                    isConnectable={true}
                />

                {/* Right handle */}
                <Handle
                    type="source"
                    position={Position.Right}
                    id={`${id}-right-source`}
                    className="w-3 h-3 !bg-blue-500 cursor-pointer"
                    isConnectable={true}
                />

                {/* Bottom handle */}
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id={`${id}-bottom-source`}
                    className="w-3 h-3 !bg-blue-500 cursor-pointer"
                    isConnectable={true}
                />

                {/* Left handle */}
                <Handle
                    type="source"
                    position={Position.Left}
                    id={`${id}-left-source`}
                    className="w-3 h-3 !bg-blue-500 cursor-pointer"
                    isConnectable={true}
                />

                {/* Target handles on all sides */}
                <Handle
                    type="target"
                    position={Position.Top}
                    id={`${id}-top-target`}
                    className="w-3 h-3 !bg-red-500 cursor-pointer"
                    style={{ left: '75%' }}
                    isConnectable={true}
                />
                <Handle
                    type="target"
                    position={Position.Right}
                    id={`${id}-right-target`}
                    className="w-3 h-3 !bg-red-500 cursor-pointer"
                    style={{ top: '75%' }}
                    isConnectable={true}
                />
                <Handle
                    type="target"
                    position={Position.Bottom}
                    id={`${id}-bottom-target`}
                    className="w-3 h-3 !bg-red-500 cursor-pointer"
                    style={{ left: '75%' }}
                    isConnectable={true}
                />
                <Handle
                    type="target"
                    position={Position.Left}
                    id={`${id}-left-target`}
                    className="w-3 h-3 !bg-red-500 cursor-pointer"
                    style={{ top: '75%' }}
                    isConnectable={true}
                />

                {/* Node content */}
                <div className="p-2 overflow-auto w-full h-full flex items-center justify-center">
                    {data.label}
                </div>
            </div>
        </div>
    );
};

export default ResizableNode;