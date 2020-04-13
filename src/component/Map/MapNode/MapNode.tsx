import React from 'react';
import { nodeColors } from 'style/Constants';

import { MapNodeData, NodeType } from './MapNodeData';
import MapNodeShape from './MapNodeShape';

import { Team } from 'component/Player/PlayerData';

import style from './MapNode.module.scss';

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

/*
    MapNode:
    Component which visualizes a node on the game map
*/
const MapNode: React.FC<MapNodeProps> = (props) => {
    // Helper booleans
    const visible = props.team === Team.Neutral || isVisible(props.node, props.team);
    const selectable = props.team !== Team.Neutral && ((props.nodeSelected !== undefined && visible) || props.node.team === props.team);
    const hovered = props.node === props.nodeHovered;

    // Colors
    const primaryColor = visible ? nodeColors[props.node.team] : nodeColors[Team.Neutral];
    const secondaryColor = visible ? '#eeeeee' : nodeColors[Team.Neutral];
    const invertColors = (selectable && hovered);

    // Border
    //const borderRadius = (visible && (props.node.type === NodeType.Artillery || props.node.type === NodeType.Fort)) ? 5 : 50;
    //const borderStyle = (visible && props.node.type !== NodeType.Normal) ? ((props.node.type === NodeType.Artillery || props.node.type === NodeType.Factory) ? 'double' : 'inset') : 'solid';

    return (
        <g
            style = {{
                // Cursor
                cursor: (selectable && hovered) ? 'pointer' : 'default'
            }}

            // Callbacks
            onMouseEnter = {() => {if (props.onMouseEnterNode !== undefined) props.onMouseEnterNode(props.node);}}
            onMouseLeave = {() => {if (props.onMouseLeaveNode !== undefined) props.onMouseLeaveNode(props.node);}}
        >
            {
                MapNodeShape[visible ? props.node.type : NodeType.Normal]({
                    cx: props.node.x,
                    cy: props.node.y,
                    fill: invertColors ? secondaryColor : primaryColor,
                    stroke: invertColors ? primaryColor : secondaryColor
                })
            }
            <text
                className = {style.mapNodeText}

                // Text position
                dominantBaseline = 'middle'

                // Position
                x = {props.node.x}
                y = {props.node.y}

                // Colors
                style = {{
                    fill: invertColors ? primaryColor : secondaryColor,
                    stroke: invertColors ? secondaryColor: primaryColor
                }}
            >
                {(visible) ? props.node.troops : null}
            </text>
        </g>
    );
}

export default MapNode;