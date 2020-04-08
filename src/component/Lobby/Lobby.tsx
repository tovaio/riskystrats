import React, { useCallback } from 'react';

import { RoomSummaryData } from './LobbyData';

// Properties for Lobby component
interface LobbyProps {
    socket: SocketIOClient.Socket | undefined,
    roomList: RoomSummaryData[] | undefined;
}

/*
    Lobby:
    React component which represents the main menu of the game
*/
const Lobby: React.FC<LobbyProps> = props => {
    const createRoom = useCallback(
        () => {
            if (props.socket !== undefined) {
                props.socket.emit('createRoom', 2, false);
            }
        },
        [props.socket]
    )

    const joinRoom = useCallback(
        (roomSummary: RoomSummaryData) => {
            if (props.socket !== undefined) {
                props.socket.emit('joinRoom', roomSummary.id);
            }
        },
        [props.socket]
    );

    if (props.roomList !== undefined) {
        const roomSummaries = props.roomList.map(roomSummary => (
            <p onMouseDown={() => {joinRoom(roomSummary);}}>
                {roomSummary.name}: {roomSummary.nPlayers} players / {roomSummary.maxPlayers} max players / {roomSummary.nSpectators} spectators
            </p>
        ));

        return (
            <>
                <p onMouseDown={() => {createRoom();}}>
                    Create Room!
                </p>
                {roomSummaries}
            </>
        );
    } else {
        return (
            <p>Waiting to retrieve the room list from the server...</p>
        );
    }
}

export default Lobby;