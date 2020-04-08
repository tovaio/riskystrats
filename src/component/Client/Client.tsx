import React, { useEffect } from 'react';
import io from 'socket.io-client';

import { useClientState, ClientStateActionType } from './ClientState';

import Lobby from 'component/Lobby/Lobby';
import { RoomSummaryData } from 'component/Lobby/LobbyData';
import Room from 'component/Room/Room';
import { RoomDataFlat, unflattenRoom } from 'component/Room/RoomData';

import { PlayerData } from 'component/Player/PlayerData';

/*
    Client:
    React component which manages state, renders the main lobby/game rooms, etc.
*/
const Client: React.FC = () => {
    const [state, dispatch] = useClientState();

    // Connect to WebSocket server
    useEffect(
        () => {
            console.log("connecting!");
            const url = (process.env.NODE_ENV === 'production') ? 'https://riskystrats.herokuapp.com' : 'http://localhost:3001';
            const socket = io.connect(url);
            dispatch({type: ClientStateActionType.SetSocket, socket: socket});

            socket.on('roomList', (roomListJSON: string) => {
                const roomList: RoomSummaryData[] = JSON.parse(roomListJSON);
                //window.alert('got roomlist!');
                dispatch({type: ClientStateActionType.SetRoomList, roomList: roomList});
            });

            socket.on('playerData', (playerDataJSON: string) => {
                const playerData: PlayerData = JSON.parse(playerDataJSON);
                dispatch({type: ClientStateActionType.SetPlayer, player: playerData});
            });

            socket.on('roomData', (roomDataJSON: string) => {
                const flatRoomData: RoomDataFlat | null = JSON.parse(roomDataJSON);
                const roomData = (flatRoomData !== null) ? unflattenRoom(flatRoomData) : undefined;
                dispatch({type: ClientStateActionType.SetRoom, room: roomData});
            });

            return () => {
                socket.disconnect();
                dispatch({type: ClientStateActionType.SetSocket, socket: undefined});
            }
        },
        [dispatch]
    );

    if (state.socket !== undefined && state.player !== undefined && state.room !== undefined) {
        // Render room
        return (
            <Room
                socket = {state.socket}
                player = {state.player}
                room = {state.room}
            />
        )
    } else {
        // Render lobby
        return (
            <Lobby
                socket = {state.socket}
                roomList = {state.roomList}
            />
        )
    }
}

export default Client;