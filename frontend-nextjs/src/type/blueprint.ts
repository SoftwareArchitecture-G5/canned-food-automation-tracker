import {Node, Edge} from 'reactflow'

export interface Blueprint {
    blueprint_id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
    created_at: Date;
}

interface Nodes {
    id: string;
    data: {
        label: string;
    }
    type: string;
    width: number;
    height: number;
    dragging: boolean;
    position: {
        x: number;
        y: number;
    }
    selected: boolean;
    positionAbsolute: {
        x: number;
        y: number;
    }
}

interface Edges {
    id: string;
    source: string;
    target: string;
}
