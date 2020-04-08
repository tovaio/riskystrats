import React from 'react';
import { nodeRadius, armyRadius, nodeColors } from 'style/Constants';

import { MapArmyData } from './MapArmyData';

import { Team } from 'component/Player/PlayerData';

import styles from './MapArmy.module.scss';

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
                className = {styles.mapArmyCircle}

                // Size and position
                r = {armyRadius}
                transform = {`translate(${x}, ${y})`}

                // Color
                style = {{
                    fill: color
                }}
            />
            <text
                className = {styles.mapArmyText}

                // Text position
                dominantBaseline = 'middle'
                transform = {`translate(${x}, ${y})`}

                // Color
                style = {{
                    stroke: color
                }}
            >
                {props.army.troops}
            </text>
        </>
    );
}

export default MapArmy;