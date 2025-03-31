"use client"

import React, { useEffect, useRef } from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';
import { Package } from 'lucide-react';

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

    const pathRef = useRef<SVGPathElement>(null);
    const iconRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const path = pathRef.current;
        const icon = iconRef.current;

        if (!path || !icon) return;

        // Get the total length of the path
        const pathLength = path.getTotalLength();

        // Animation function
        let progress = 0;
        let animationFrameId: number;

        const animatePackage = () => {
            progress = (progress + 0.005) % 1; // Move 0.5% along the path each frame

            if (path && icon) {
                // Get the point at the current position along the path
                const point = path.getPointAtLength(pathLength * progress);

                // Calculate the angle for proper rotation
                let angle = 0;
                const pointAhead = path.getPointAtLength(pathLength * Math.min(progress + 0.01, 0.99));
                if (pointAhead.x !== point.x || pointAhead.y !== point.y) {
                    angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * (180 / Math.PI);
                }

                // Transform the icon to the correct position and rotation
                icon.setAttribute('transform', `translate(${point.x - 10}, ${point.y - 10}) rotate(${angle}, 10, 10)`);
            }

            animationFrameId = requestAnimationFrame(animatePackage);
        };

        animationFrameId = requestAnimationFrame(animatePackage);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [edgePath]);

    return (
        <>
            {/* Invisible reference path for animation calculations */}
            <path
                ref={pathRef}
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={0}
            />

            {/* Visible path - solid line */}
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                stroke="#4285f4"
                strokeWidth={2}
                fill="none"
                markerEnd={markerEnd}
            />

            {/* Package icon that will move along the path */}
            <g ref={iconRef}>
                <Package size={20} color="#4285f4" />
            </g>
        </>
    );
};

export default AnimatedSVGEdge;