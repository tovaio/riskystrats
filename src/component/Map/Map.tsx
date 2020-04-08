import React from 'react';

import { MapData } from './MapData';

import MapNode from './MapNode/MapNode';
import { MapNodeData } from './MapNode/MapNodeData';
import MapEdge from './MapEdge/MapEdge';

import { Team } from 'component/Player/PlayerData';

import './Map.css';

// Properties for Map component
interface MapProps {
    map: MapData,
    team: Team,
    nodeHoveredID?: number,
    nodeSelectedID?: number,
    onMouseEnterNode?: (node: MapNodeData) => void,
    onMouseLeaveNode?: (node: MapNodeData) => void
}

/*
    Map:
    React component which resembles just the geometry of the game (nodes and edges)
*/
const Map: React.FC<MapProps> = props => {
    const nodeHovered = (props.nodeHoveredID !== undefined) ? props.map.nodes[props.nodeHoveredID] : undefined;
    const nodeSelected = (props.nodeSelectedID !== undefined) ? props.map.nodes[props.nodeSelectedID] : undefined;
    
    const nodes = props.map.nodes.map(node => (
        <MapNode
            node = {node}
            team = {props.team}
            nodeHovered = {nodeHovered}
            nodeSelected = {nodeSelected}
            onMouseEnterNode = {props.onMouseEnterNode}
            onMouseLeaveNode = {props.onMouseLeaveNode}
            key = {`node_${node.id}`}
        />
    ));

    const edges = props.map.edges.map(([node1, node2]) => (
        <MapEdge
            node1 = {node1}
            node2 = {node2}
            team = {props.team}
            nodeSelected = {nodeSelected}
            key = {`edge_${node1.id}_${node2.id}`}
        />
    ));

    return (
        <>
            {edges.concat(nodes)}
        </>
    );
}

export default Map;