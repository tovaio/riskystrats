import React from 'react';
import { nodeRadius, armyRadius, scaleFactor, nodeColors } from '../Util';

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
        <div
            className='mapArmy'

            // CSS
            style={{
                // Dimensions
                width: `${armyRadius * 2 / scaleFactor}vmin`,
                height: `${armyRadius * 2 / scaleFactor}vmin`,

                // Position
                left: `calc(50% + ${(x - armyRadius) / scaleFactor}vmin)`,
                top: `calc(50% + ${(y - armyRadius) / scaleFactor}vmin)`,

                // Color
                backgroundColor: color,

                // Text stroke
                textShadow: `
                    -1px -1px 0 ${color},
                    -1px  1px 0 ${color},
                     1px -1px 0 ${color},
                     1px  1px 0 ${color},
                    -1px    0 0 ${color},
                     1px    0 0 ${color},
                       0 -1px 0 ${color},
                       0  1px 0 ${color}
                `
            }}
        >
            <p>{props.army.troops}</p>
        </div>
    )
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