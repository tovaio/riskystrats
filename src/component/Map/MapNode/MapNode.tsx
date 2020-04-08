import React from 'react';
import { nodeColors, nodeRadius, edgeWidth } from 'style/Constants';

import { MapNodeData } from './MapNodeData';

import { Team } from 'component/Player/PlayerData';

import styles from './MapNode.module.scss';

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
    const selected = props.node === props.nodeSelected;
    const hovered = props.node === props.nodeHovered;
    const assigned = props.nodeSelected !== undefined && props.nodeSelected.assign === props.node; 

    // Colors
    const primaryColor = visible ? nodeColors[props.node.team] : nodeColors[Team.Neutral];
    const secondaryColor = visible ? '#eeeeee' : nodeColors[Team.Neutral];
    const invertColors = (selectable && hovered) || selected;

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
            <circle
                className = {styles.mapNodeCircle}

                // Position
                cx = {props.node.x}
                cy = {props.node.y}
                r = {nodeRadius}

                // Colors
                style = {{
                    fill: invertColors ? secondaryColor : primaryColor,
                    stroke: invertColors ? primaryColor : secondaryColor
                }}
            />
            <text
                className = {styles.mapNodeText}

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
            {
                assigned ? (
                    <circle
                        className = 'select'
                        cx = {props.node.x}
                        cy = {props.node.y}
                        r = {nodeRadius * 1.5}

                        style = {{
                            // Stroke
                            stroke: '#eeee00',
                            strokeWidth: edgeWidth,
                            strokeDasharray: '1 1 1 1 1 1 1 1',

                            // No fill
                            fillOpacity: 0
                        }}
                    />
                ) : null
            }
        </g>
    );
}

export default MapNode;