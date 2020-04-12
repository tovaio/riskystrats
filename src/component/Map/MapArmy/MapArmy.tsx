import React, { useEffect } from 'react';
import gsap from 'gsap';

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
    // Color
    const color = nodeColors[props.army.team];

    useEffect(
        () => {
            const fromNode = props.army.from;
            const toNode = props.army.to;

            // Math
            const xDiff = toNode.x - fromNode.x;
            const yDiff = toNode.y - fromNode.y;

            const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
            const btwnDistance = nodeRadius + armyRadius + props.army.distance * (distance - 2 * nodeRadius - 2 * armyRadius) / distance;

            const angle = Math.atan2(yDiff, xDiff);

            const x = fromNode.x + Math.cos(angle) * btwnDistance;
            const y = fromNode.y + Math.sin(angle) * btwnDistance;

            if (props.army.distance > 0) {
                gsap.to(`.army-${props.army.id}`, 0.5, {
                    x: x,
                    y: y,
                    ease: "none"
                });
            } else {
                gsap.set(`.army-${props.army.id}`, {
                    x: x,
                    y: y
                });
            }
        },
        [props.army]
    );

    // Don't show if not visible to player!
    if (props.team !== Team.Neutral && props.army.from.team !== props.team && props.army.to.team !== props.team)
        return <></>;

    return (
        <>
            <circle
                className = {`${styles.mapArmyCircle} army-${props.army.id}`}

                // Size and position
                r = {armyRadius}

                // Color
                style = {{
                    fill: color
                }}
            />
            <text
                className = {`${styles.mapArmyText} army-${props.army.id}`}

                // Text position
                dominantBaseline = 'middle'

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