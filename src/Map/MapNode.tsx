import React from 'react';
import { nodeColors, nodeRadius, edgeWidth, scaleFactor } from '../Util';

import { Team } from '../Player';

// Determines if a node is visible to a certain player.
const isVisible = (node: MapNodeData, team: Team): boolean => {
    if (node.team === team) {
        return true;
    } else {
        for (let adjNode of node.adj) {
            if (adjNode.team === team)
                return true;
        }
        return false;
    }
}

// Properties for MapNode component
interface MapNodeProps {
    node: MapNodeData,                                  // Node represented by this component
    team: Team,                                         // Team of the player rendering this node
    nodeHovered?: MapNodeData,                          // Node that the player is hovering over
    nodeSelected?: MapNodeData,                         // Node that the player has currently selected
    onMouseEnterNode?: (node: MapNodeData) => void,     // Callback for when the player's mouse enters the node
    onMouseLeaveNode?: (node: MapNodeData) => void      // Callback for when the player's mouse leaves the node
}

// Types of buildings on nodes
export enum NodeType {
    Normal,             // No building (default for all nodes)
    Factory,            // Factory (generates more troops per second)
    PowerPlant,         // PowerPlant (increases production output of adjacent factories)
    Fort,               // Fort (adds defensive bonus against incoming enemy armies)
    Artillery           // Artillery (adds offensive bonus to outgoing friendly armies)
}

/*
    MapNode:
    Component which visualizes a node on the game map
*/
const MapNode: React.FC<MapNodeProps> = (props) => {
    // Helper booleans
    const visible = props.team === Team.Neutral || isVisible(props.node, props.team);
    const selectable = props.team !== Team.Neutral && ((props.nodeSelected !== undefined && visible) || props.node.team === props.team);
    const selected = props.node === props.nodeSelected;
    const hovered = props.node === props.nodeHovered;
    const assigned = props.nodeSelected !== undefined && props.nodeSelected.assign === props.node; 

    // Colors
    const primaryColor = visible ? nodeColors[props.node.team] : nodeColors[Team.Neutral];
    const secondaryColor = visible ? '#eeeeee' : nodeColors[Team.Neutral];
    const invertColors = (selectable && hovered) || selected;

    // Border
    const borderRadius = (visible && (props.node.type === NodeType.Artillery || props.node.type === NodeType.Fort)) ? 5 : 50;
    const borderStyle = (visible && props.node.type !== NodeType.Normal) ? ((props.node.type === NodeType.Artillery || props.node.type === NodeType.Factory) ? 'double' : 'inset') : 'solid';

    return (
        <div
            className = 'mapNode'

            // Callbacks
            onMouseEnter = {() => {if (props.onMouseEnterNode !== undefined) props.onMouseEnterNode(props.node);}}
            onMouseLeave = {() => {if (props.onMouseLeaveNode !== undefined) props.onMouseLeaveNode(props.node);}}

            // CSS
            style = {{
                // Dimensions
                width: `${nodeRadius * 2 / scaleFactor}vmin`,
                height: `${nodeRadius * 2 / scaleFactor}vmin`,

                // Position
                left: `calc(50% + ${(props.node.x - nodeRadius) / scaleFactor}vmin)`,
                top: `calc(50% + ${(props.node.y - nodeRadius) / scaleFactor}vmin)`,

                // Border
                borderStyle: borderStyle,
                borderWidth: `${edgeWidth / scaleFactor}vmin`,
                borderRadius: borderRadius,

                // Color
                backgroundColor: invertColors ? secondaryColor : primaryColor,
                color: invertColors ? primaryColor : secondaryColor,
                borderColor: invertColors ? primaryColor : secondaryColor,

                // Cursor
                cursor: (selectable && hovered) ? 'pointer' : 'default',

                // Text stroke
                textShadow: `
                    -2px -2px 0 ${invertColors ? secondaryColor: primaryColor},
                    -2px  2px 0 ${invertColors ? secondaryColor: primaryColor},
                     2px -2px 0 ${invertColors ? secondaryColor: primaryColor},
                     2px  2px 0 ${invertColors ? secondaryColor: primaryColor},
                    -2px    0 0 ${invertColors ? secondaryColor: primaryColor},
                     2px    0 0 ${invertColors ? secondaryColor: primaryColor},
                       0 -2px 0 ${invertColors ? secondaryColor: primaryColor},
                       0  2px 0 ${invertColors ? secondaryColor: primaryColor}
                `,

                // Assignment glow
                boxShadow: assigned ? `0 0 30px #ffff00` : ''
            }}
        >
            {
                // Troop count (only if visible)
                <p>{(visible) ? props.node.troops : null}</p>
            }
        </div>
    );
}

export default MapNode;

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