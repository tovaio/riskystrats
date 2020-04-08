import { MapNodeData, MapNodeDataFlat } from './MapNode/MapNodeData';

// Data interface for Map
export interface MapData {
    nodes: MapNodeData[],
    edges: [MapNodeData, MapNodeData][]
}

// Non-recursive data interface for Map
export interface MapDataFlat {
    nodes: MapNodeDataFlat[],
    edges: [number, number][]
}