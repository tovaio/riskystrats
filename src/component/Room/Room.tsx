import React, { useCallback, useEffect } from 'react';

import { RoomData } from './RoomData';
import { useRoomState, RoomStateActionType } from './RoomState';

import Game from 'component/Game/Game';
import { MapNodeData, NodeType } from 'component/Map/MapNode/MapNodeData';

import { PlayerData, Team } from 'component/Player/PlayerData';

// Properties for Room component
interface RoomProps {
    socket: SocketIOClient.Socket,
    room: RoomData,
    player: PlayerData
}

/*
    Room:
    React component which manages the rendering and functionality of a game room
*/
const Room: React.FC<RoomProps> = props => {
    const [state, dispatch] = useRoomState();

    // Set nodeHoveredID in roomState when the player's mouse enters/leaves a node
    const onMouseEnterNode = useCallback(
        (node: MapNodeData) => {
            dispatch({type: RoomStateActionType.SetNodeHoveredID, nodeHoveredID: node.id});
        },
        [dispatch]
    );
    const onMouseLeaveNode = useCallback(
        () => {
            dispatch({type: RoomStateActionType.SetNodeHoveredID, nodeHoveredID: undefined});
        },
        [dispatch]
    );

    // Callback to perform socket actions / adjust roomState when the player presses a button
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (props.socket === undefined || props.room === undefined || props.room.game === undefined || props.player === undefined || state.nodeSelectedID === undefined)
                return;

            const nodeSelected = props.room.game.map.nodes[state.nodeSelectedID];
            if (nodeSelected === undefined || nodeSelected.team !== props.player.team)
                return;

            const key = e.which || e.keyCode;

            let unselect = true;

            switch (String.fromCharCode(key)) {
                case 'A':
                    props.socket.emit('build', state.nodeSelectedID, NodeType.Factory);
                    break;
                case 'S':
                    props.socket.emit('build', state.nodeSelectedID, NodeType.PowerPlant);
                    break;
                case 'Z':
                    props.socket.emit('build', state.nodeSelectedID, NodeType.Fort);
                    break;
                case 'X':
                    props.socket.emit('build', state.nodeSelectedID, NodeType.Artillery);
                    break;
                case 'Q':
                    if (state.nodeHoveredID === undefined || state.nodeHoveredID === state.nodeSelectedID)
                        break;
                    props.socket.emit('sendArmy', state.nodeSelectedID, state.nodeHoveredID, 10);
                    unselect = false;
                    break;
                case 'W':
                    if (state.nodeHoveredID === undefined || state.nodeHoveredID === state.nodeSelectedID)
                        break;
                    props.socket.emit('sendArmy', state.nodeSelectedID, state.nodeHoveredID, 100);
                    unselect = false;
                    break;
                case 'E':
                    if (state.nodeHoveredID === state.nodeSelectedID)
                        break;
                    props.socket.emit('assign', state.nodeSelectedID, (state.nodeHoveredID !== undefined) ? state.nodeHoveredID : -1);
                    unselect = false;
                    break;
            }
            if (unselect)
                dispatch({type: RoomStateActionType.SetNodeSelectedID, nodeSelectedID: undefined});
        },
        [props, state, dispatch]
    );

    // Callback to adjust nodeSelected when mouse is clicked
    const onMouseDown = useCallback(
        () => {
            dispatch({type: RoomStateActionType.SetMouseDown, mouseDown: true});
            if (state.nodeHoveredID !== undefined && props.room !== undefined && props.room.game !== undefined && props.player.team !== Team.Neutral) {
                const nodeHovered = props.room.game.map.nodes[state.nodeHoveredID];
                if (nodeHovered !== undefined && nodeHovered.team === props.player.team) {
                    dispatch({type: RoomStateActionType.SetNodeSelectedID, nodeSelectedID: nodeHovered.id});
                    return;
                }
            }
            dispatch({type: RoomStateActionType.SetNodeSelectedID, nodeSelectedID: undefined});
        },
        [props, state, dispatch]
    );

    // Callback when mouse up
    const onMouseUp = useCallback(
        () => {
            dispatch({type: RoomStateActionType.SetMouseDown, mouseDown: false});
        },
        [dispatch]
    );

    // Bind event listeners
    useEffect(
        () => {
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
            return () => {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mouseup', onMouseUp);
            }
        },
        [onKeyDown, onMouseDown, onMouseUp]
    );

    if (props.room.game !== undefined) {
        return (
            <Game
                game = {props.room.game}
                team = {props.player.team}
                nodeHoveredID = {state.nodeHoveredID}
                nodeSelectedID = {state.nodeSelectedID}
                onMouseEnterNode = {onMouseEnterNode}
                onMouseLeaveNode = {onMouseLeaveNode}
            />
        );
    } else {
        if (props.room.players.length === props.room.summary.maxPlayers && props.player.id === props.room.players[0].id) {
            props.socket.emit('startRoom');
        }
        return (
            <p>
                Waiting for at least {props.room.summary.maxPlayers} players... (currently at {props.room.summary.nPlayers}!) <br/>
                Perhaps invite friends or open up a new tab of this game?
            </p>
        );
    }
}

export default Room;