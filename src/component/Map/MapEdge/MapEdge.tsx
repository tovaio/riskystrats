import React from 'react';
import { nodeColors, edgeWidth } from 'style/Constants';

import { MapNodeData } from 'component/Map/MapNode/MapNodeData';
import { Team } from 'component/Player/PlayerData';

import styles from './MapEdge.module.scss';

// Properties for MapEdge component
interface MapEdgeProps {
    node1: MapNodeData,                         // The first endpoint node of the edge
    node2: MapNodeData,                         // The second endpoint node of the edge
    team: Team,                                 // Team of the player that is rendering this edge
    nodeSelected?: MapNodeData                  // Node that the player currently has selected
}

/*
    MapEdge:
    Component which represents an edge between two nodes on the game map
*/
const MapEdge: React.FC<MapEdgeProps> = props => {
    // Helper booleans
    const visible = props.team === Team.Neutral || props.node1.team === props.team || props.node2.team === props.team;

    return (
        <line
            className = {visible ? styles.mapEdgeVisible : styles.mapEdgeInvisible}

            // Position
            x1 = {props.node1.x}
            y1 = {props.node1.y}
            x2 = {props.node2.x}
            y2 = {props.node2.y}

            // Style
            style={{
                // Stroke style
                stroke: visible ? '#eeeeee' : nodeColors[Team.Neutral],
                strokeWidth: edgeWidth,

                // Transition
                transition: 'stroke 0.15s'
            }}
        />
    );
}

export default MapEdge;