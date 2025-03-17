export interface Blueprint {
    id: string;
    name: string;
    nodes: Nodes[];
    edges: Edges[];
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
