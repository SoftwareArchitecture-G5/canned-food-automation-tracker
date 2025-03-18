import {Node, Edge} from 'reactflow'

export interface Blueprint {
    blueprint_id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
    created_at: Date;
}