import React from 'react';
import { nodeRadius, armyRadius, fontStack, nodeColors, edgeWidth } from '../Util';

import { MapNodeData } from './MapNode';
import { Team } from '../Player';

// Properties for MapArmy component
interface MapArmyProps {
    army: MapArmyData,
    team: Team
}

/*
    MapArmy:
    Component which represents a travelling army on the game map
*/
const MapArmy: React.FC<MapArmyProps> = (props) => {
    const fromNode = props.army.from;
    const toNode = props.army.to;

    // Don't show if not visible to player!
    if (props.team !== Team.Neutral && fromNode.team !== props.team && toNode.team !== props.team)
        return <></>;
    
    // Math
    const xDiff = toNode.x - fromNode.x;
    const yDiff = toNode.y - fromNode.y;

    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const btwnDistance = nodeRadius + armyRadius + props.army.distance * (distance - 2 * nodeRadius - 2 * armyRadius) / distance;

    const angle = Math.atan2(yDiff, xDiff);

    const x = fromNode.x + Math.cos(angle) * btwnDistance;
    const y = fromNode.y + Math.sin(angle) * btwnDistance;

    // Color
    const color = nodeColors[props.army.team];

    return (
        <>
            <circle
                // Size
                r = {armyRadius}
                transform = {`translate(${x}, ${y})`}

                // Style
                style = {{
                    // Fill color
                    fill: color,

                    // Transition
                    transition: 'all 0.5s linear'
                }}
            />
            <text
                // Text position
                textAnchor = 'middle'
                alignmentBaseline = 'middle'
                transform = {`translate(${x}, ${y})`}

                // Style
                style = {{
                    // Text style
                    fill: '#eeeeee',
                    fontFamily: fontStack,
                    fontWeight: 900,
                    fontSize: 1.5,

                    // Stroke style
                    paintOrder: 'stroke',
                    stroke: color,
                    strokeWidth: 0.25,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',

                    // Transition
                    transition: 'all 0.5s linear'
                }}
            >
                {props.army.troops}
            </text>
        </>
    );
}

export default MapArmy;

export interface MapArmyData {
    from: MapNodeData,
    to: MapNodeData,
    troops: number,
    distance: number,
    team: Team,
    id: number
}

export interface MapArmyDataFlat {
    from: number,
    to: number,
    troops: number,
    distance: number,
    team: Team,
    id: number
}