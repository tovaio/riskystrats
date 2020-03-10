import React, { useEffect, useCallback, useRef, useReducer } from 'react';
import io from 'socket.io-client';
import './Map.css';

type PlayerID = 0 | 1 | 2 | 3 | 4;
enum NodeType {Normal, Factory, PowerPlant, Fort, Artillery};

const nodeRadius = 2;
const armyRadius = 1;
const connectionWidth = 5/9;

const scaleFactor = 1;

interface MapNodeProps {
    x: number,
    y: number,
    visible: boolean,
    owned: boolean,
    hovering: boolean,
    team: PlayerID,
    army: number,
    type: NodeType,
    nodeID: number,
    selectedNodeID: number,
    assigned: boolean,
    onMouseEnter: () => void,
    onMouseLeave: () => void
}

const nodeColors = [
    '#444444',
    '#DD0000',
    '#00DD00',
    '#0000DD',
    '#DD00DD'
]

const MapNode: React.FC<MapNodeProps> = (props) => {
    const primaryColor = props.visible ? nodeColors[props.team] : nodeColors[0];
    const secondaryColor = props.visible ? '#eeeeee' : nodeColors[0];
    const hasSelected = props.selectedNodeID >= 0;
    const selectable = (hasSelected && props.visible) || props.owned;
    const selected = props.nodeID === props.selectedNodeID;
    const invertColors = (selectable && props.hovering) || selected;

    const borderRadius = (props.visible && (props.type === NodeType.Artillery || props.type === NodeType.Fort)) ? 5 : 50;
    const borderType = (props.visible && props.type !== NodeType.Normal) ? ((props.type === NodeType.Artillery || props.type === NodeType.Factory) ? 'double' : 'inset') : 'solid';

    return (
        <div
            className='mapNode'
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            style={{
                width: `${nodeRadius * 2 / scaleFactor}vmin`,
                height: `${nodeRadius * 2 / scaleFactor}vmin`,
                borderStyle: borderType,
                borderWidth: `${connectionWidth / scaleFactor}vmin`,
                left: `calc(50% + ${(props.x - nodeRadius) / scaleFactor}vmin)`,
                top: `calc(50% + ${(props.y - nodeRadius) / scaleFactor}vmin)`,
                backgroundColor: invertColors ? secondaryColor : primaryColor,
                color: invertColors ? primaryColor : secondaryColor,
                borderColor: invertColors ? primaryColor : secondaryColor,
                cursor: (selectable && props.hovering) ? 'pointer' : 'default',
                borderRadius: borderRadius,
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
                boxShadow: (props.assigned) ? `0 0 30px #ffff00` : ''
            }}
        >
            {
                <p>{(props.visible) ? props.army : null}</p>
            }
        </div>
    );
}

interface MapConnectionProps {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    visible: boolean
}

const MapConnection: React.FC<MapConnectionProps> = (props) => {
    let angle = Math.atan2((props.y2-props.y1), (props.x2-props.x1));
    let length = Math.sqrt((props.x2-props.x1)*(props.x2-props.x1) + (props.y2-props.y1)*(props.y2-props.y1));
    return (
        <div
            className='mapConnection'
            style={{
                width: `${length / scaleFactor}vmin`,
                height: `${connectionWidth / scaleFactor}vmin`,
                left: `calc(50% + ${(props.x1 + Math.cos(angle - Math.PI / 2) * connectionWidth / 2) / scaleFactor}vmin)`,
                top: `calc(50% + ${(props.y1 + Math.sin(angle - Math.PI / 2) * connectionWidth / 2) / scaleFactor}vmin)`,
                transform: `rotate(${angle * 180 / Math.PI}deg)`,
                backgroundColor: props.visible ? '#eeeeee' : nodeColors[0]
            }}
        />
    );
}

interface MapArmyProps {
    x: number,
    y: number,
    team: PlayerID,
    count: number,
    armyID: number,
}

const MapArmy: React.FC<MapArmyProps> = (props) => {
    return (
        <div
            className='mapArmy'
            style={{
                width: `${armyRadius * 2 / scaleFactor}vmin`,
                height: `${armyRadius * 2 / scaleFactor}vmin`,
                left: `calc(50% + ${(props.x - armyRadius) / scaleFactor}vmin)`,
                top: `calc(50% + ${(props.y - armyRadius) / scaleFactor}vmin)`,
                backgroundColor: nodeColors[props.team],
                textShadow: `
                    -1px -1px 0 ${nodeColors[props.team]},
                    -1px  1px 0 ${nodeColors[props.team]},
                     1px -1px 0 ${nodeColors[props.team]},
                     1px  1px 0 ${nodeColors[props.team]},
                    -1px    0 0 ${nodeColors[props.team]},
                     1px    0 0 ${nodeColors[props.team]},
                       0 -1px 0 ${nodeColors[props.team]},
                       0  1px 0 ${nodeColors[props.team]}
                `
            }}
        >
            <p>{props.count}</p>
        </div>
    )
}

interface NodeObject {
    x: number,
    y: number,
    id: number,
    adj: number[],
    team: PlayerID,
    army: number,
    type: NodeType,
    assign: number
}

interface ArmyObject {
    from: number,
    to: number,
    count: number,
    distance: number,
    team: PlayerID,
    id: number
}

interface NetworkObject {
    nodes: NodeObject[],
    connections: [number, number][],
    armies: ArmyObject[]
}

const areNodesAdjacent = (nodeID1: number, nodeID2: number, net: NetworkObject): boolean => {
    for (let adjID of net.nodes[nodeID1].adj) {
        if (adjID === nodeID2)
            return true;
    }
    return false;
}

const isNodeVisible = (nodeID: number, net: NetworkObject, playerID: PlayerID): boolean => {
    if (playerID === 0 || net.nodes[nodeID].team === playerID)
        return true;
    else {
        for (let adjID of net.nodes[nodeID].adj) {
            if (net.nodes[adjID].team === playerID)
                return true;
        }
        return false;
    }
}

const isConnectionVisible = (connection: [number, number], net: NetworkObject, playerID: PlayerID): boolean => {
    return (playerID === 0) || (net.nodes[connection[0]].team === playerID) || (net.nodes[connection[1]].team === playerID);
}

interface MapState {
    net: NetworkObject,
    playerID: number,
    hoveredNodeID: number,
    selectedNodeID: number
}

enum MapActionType {
    SetNet,
    SetPlayerID,
    SetSelectedNodeID,
    SetHoveredNodeID
}

interface MapAction {
    type: MapActionType,
    payload?: any
}

const initMapState: MapState = {
    net: {
        nodes: [],
        connections: [],
        armies: []
    },
    playerID: -1,
    hoveredNodeID: -1,
    selectedNodeID: -1
}

const mapReducer = (state: MapState, action: MapAction) => {
    switch (action.type) {
        case MapActionType.SetNet:
            return {
                net: action.payload,
                playerID: state.playerID,
                hoveredNodeID: state.hoveredNodeID,
                selectedNodeID: state.selectedNodeID
            };
        case MapActionType.SetPlayerID:
            return {
                net: state.net,
                playerID: action.payload,
                hoveredNodeID: state.hoveredNodeID,
                selectedNodeID: state.selectedNodeID
            };
        case MapActionType.SetHoveredNodeID:
            return {
                net: state.net,
                playerID: state.playerID,
                hoveredNodeID: action.payload,
                selectedNodeID: state.selectedNodeID
            };
        case MapActionType.SetSelectedNodeID:
            let newSelectedNodeID = -1;
            if (state.hoveredNodeID >= 0 && state.hoveredNodeID !== state.selectedNodeID && state.net.nodes[state.hoveredNodeID].team === (state.playerID as PlayerID))
                newSelectedNodeID = state.hoveredNodeID;
            return {
                net: state.net,
                playerID: state.playerID,
                hoveredNodeID: state.hoveredNodeID,
                selectedNodeID: newSelectedNodeID
            };
        default:
            throw new Error("Action type not found for mapReducer!");
    }
}

const Map: React.FC = () => {
    const [state, dispatch]: [MapState, React.Dispatch<MapAction>] = useReducer(mapReducer, initMapState);
    const socketRef: React.MutableRefObject<SocketIOClient.Socket | null> = useRef(null);

    const onMouseEnterNode = useCallback((nodeID: number) => {
        dispatch({type: MapActionType.SetHoveredNodeID, payload: nodeID});
    }, []);

    const onMouseLeaveNode = useCallback(() => {
        dispatch({type: MapActionType.SetHoveredNodeID, payload: -1});
    }, []);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (state.selectedNodeID < 0
            || state.net.nodes[state.selectedNodeID].team !== (state.playerID as PlayerID)
            || socketRef.current == null)
            return;
        
        const node = state.net.nodes[state.selectedNodeID];
        const key = e.which || e.keyCode;
        console.log(key);

        let unselect = true;

        switch (String.fromCharCode(key)) {
            case 'A':
                socketRef.current.emit('convert', node.id, NodeType.Factory);
                break;
            case 'S':
                socketRef.current.emit('convert', node.id, NodeType.PowerPlant);
                break;
            case 'Z':
                socketRef.current.emit('convert', node.id, NodeType.Fort);
                break;
            case 'X':
                socketRef.current.emit('convert', node.id, NodeType.Artillery);
                break;
            case 'Q':
                if (state.hoveredNodeID < 0 || state.hoveredNodeID === node.id) break;
                socketRef.current.emit('sendArmy', node.id, state.hoveredNodeID, 10);
                unselect = false;
                break;
            case 'W':
                if (state.hoveredNodeID < 0 || state.hoveredNodeID === node.id) break;
                socketRef.current.emit('sendArmy', node.id, state.hoveredNodeID, 100);
                unselect = false;
                break;
            case 'E':
                if (state.hoveredNodeID === node.id) break;
                socketRef.current.emit('assign', node.id, state.hoveredNodeID);
                unselect = false;
                break;
        }
        if (unselect) dispatch({type: MapActionType.SetSelectedNodeID, payload: -1});
    }, [state]);

    const onMouseDown = useCallback(() => {
        console.log("called!");
        dispatch({type: MapActionType.SetSelectedNodeID});
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [onKeyDown]);

    useEffect(() => {
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
        }
    }, [onMouseDown]);

    useEffect(() => {
        console.log("connecting!");
        const socket = io.connect('https://riskystrats.herokuapp.com:3001');
        socketRef.current = socket;

        socket.on('playerID', (newPlayerID: PlayerID) => {
            dispatch({type: MapActionType.SetPlayerID, payload: newPlayerID});
        });

        socket.on('network', (networkString: string) => {
            dispatch({type: MapActionType.SetNet, payload: JSON.parse(networkString)});
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        }
    }, [socketRef]);

    return (
        <div className='map'>
            {
                (state.net.nodes.length === 0) ? "Loading map..." :
                (state.playerID < 0)           ? "Waiting for server..." :
                state.net.nodes.map((node) => (
                    <MapNode
                        x={node.x}
                        y={node.y}
                        team={node.team}
                        army={node.army}
                        type={node.type}
                        visible={isNodeVisible(node.id, state.net, state.playerID as PlayerID)}
                        hovering={state.hoveredNodeID === node.id}
                        owned={node.team === state.playerID}
                        nodeID={node.id}
                        selectedNodeID={state.selectedNodeID}
                        assigned={state.selectedNodeID > 0 && state.net.nodes[state.selectedNodeID].assign === node.id}
                        onMouseEnter={() => {onMouseEnterNode(node.id);}}
                        onMouseLeave={() => {onMouseLeaveNode();}}
                        key={node.id}
                    />
                )).concat(
                    state.net.connections.map(([id1, id2]) => (
                        <MapConnection
                            x1={state.net.nodes[id1].x}
                            x2={state.net.nodes[id2].x}
                            y1={state.net.nodes[id1].y}
                            y2={state.net.nodes[id2].y}
                            visible={isConnectionVisible([id1, id2], state.net, state.playerID as PlayerID)}
                            key={`${id1}_${id2}`}
                        />
                    ))
                ).concat(
                    state.net.armies.map((army) => {
                        const fromNode = state.net.nodes[army.from];
                        const toNode = state.net.nodes[army.to];
                        if (fromNode.team !== (state.playerID as PlayerID) && toNode.team !== (state.playerID as PlayerID))
                            return <></>;
                        const xDiff = toNode.x - fromNode.x;
                        const yDiff = toNode.y - fromNode.y;
                        const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
                        const btwnDistance = nodeRadius + armyRadius + army.distance * (distance - 2 * nodeRadius - 2 * armyRadius) / distance;
                        const angle = Math.atan2(yDiff, xDiff);
                        return (
                            <MapArmy
                                x={fromNode.x + Math.cos(angle) * btwnDistance}
                                y={fromNode.y + Math.sin(angle) * btwnDistance}
                                team={army.team}
                                count={army.count}
                                armyID={army.id}
                                key={`army_${army.id}`}
                            />
                        )
                    })
                )
            }
        </div>
    );
}

export default Map;