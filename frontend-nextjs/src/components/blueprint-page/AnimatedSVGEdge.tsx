"use client"

import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

const AnimatedSVGEdge = ({
                             id,
                             sourceX,
                             sourceY,
                             targetX,
                             targetY,
                             sourcePosition,
                             targetPosition,
                             style = {},
                             markerEnd,
                         }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <path
            id={id}
            style={style}
            className="react-flow__edge-path-selector animated-edge"
            d={edgePath}
            markerEnd={markerEnd}
            fill="none"
        />
    );
};

export default AnimatedSVGEdge;