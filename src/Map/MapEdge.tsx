import React from 'react';
import { nodeColors, edgeWidth, scaleFactor } from '../Util';

import { Team } from '../Player';
import { MapNodeData } from './MapNode';

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
const MapEdge: React.FC<MapEdgeProps> = (props) => {
    // Helper booleans
    const visible = props.team === Team.Neutral || props.node1.team === props.team || props.node2.team === props.team;

    // Positional math
    const xDiff = props.node2.x - props.node1.x;
    const yDiff = props.node2.y - props.node1.y;

    const angle = Math.atan2(yDiff, xDiff);
    const length = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    const x = props.node1.x + Math.cos(angle - Math.PI / 2) * edgeWidth / 2;
    const y = props.node1.y + Math.sin(angle - Math.PI / 2) * edgeWidth / 2;

    return (
        <div
            className='mapEdge'

            // CSS
            style={{
                // Dimensions
                width: `${length / scaleFactor}vmin`,
                height: `${edgeWidth / scaleFactor}vmin`,

                // Position
                left: `calc(50% + ${x / scaleFactor}vmin)`,
                top: `calc(50% + ${y / scaleFactor}vmin)`,
                transform: `rotate(${angle * 180 / Math.PI}deg)`,

                // Color
                backgroundColor: visible ? '#eeeeee' : nodeColors[Team.Neutral]
            }}
        />
    );
}

export default MapEdge;