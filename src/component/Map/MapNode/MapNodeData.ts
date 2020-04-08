import { Team } from 'component/Player/PlayerData';

// Types of buildings on nodes
export enum NodeType {
    Normal,                                             // No building (default for all nodes)
    Factory,                                            // Factory (generates more troops per second)
    PowerPlant,                                         // PowerPlant (increases production output of adjacent factories)
    Fort,                                               // Fort (adds defensive bonus against incoming enemy armies)
    Artillery                                           // Artillery (adds offensive bonus to outgoing friendly armies)
}

// Data interface for MapNode
export interface MapNodeData {
    x: number,
    y: number,
    id: number,
    adj: MapNodeData[],
    team: Team,
    troops: number,
    type: NodeType,
    assign: MapNodeData | undefined
}

// Non-recursive data interface for MapNode
export interface MapNodeDataFlat {
    x: number,
    y: number,
    id: number,
    adj: number[],
    team: Team,
    troops: number,
    type: NodeType,
    assign: number
}