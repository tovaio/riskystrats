import { useReducer } from 'react';

import { PlayerData } from './Player';
import { RoomData, RoomSummaryData } from './Room';

interface ClientState {
    socket: SocketIOClient.Socket | undefined,
    room: RoomData | undefined,
    player: PlayerData | undefined,
    roomList: RoomSummaryData[] | undefined
}

export enum ClientStateActionType {
    SetSocket,
    SetRoom,
    SetPlayer,
    SetRoomList
}

interface SetSocketAction {
    type: ClientStateActionType.SetSocket,
    socket: SocketIOClient.Socket | undefined
}

interface SetRoomAction {
    type: ClientStateActionType.SetRoom,
    room: RoomData | undefined
}

interface SetPlayerAction {
    type: ClientStateActionType.SetPlayer,
    player: PlayerData | undefined
}

interface SetRoomListAction {
    type: ClientStateActionType.SetRoomList,
    roomList: RoomSummaryData[] | undefined
}

type ClientStateAction = SetSocketAction | SetRoomAction | SetPlayerAction | SetRoomListAction;

const initClientState: ClientState = {
    socket: undefined,
    room: undefined,
    player: undefined,
    roomList: undefined
};

const clientStateReducer = (state: ClientState, action: ClientStateAction): ClientState => {
    switch (action.type) {
        case ClientStateActionType.SetSocket:
            return {
                socket: action.socket,
                room: state.room,
                player: state.player,
                roomList: state.roomList
            }
        case ClientStateActionType.SetRoom:
            return {
                socket: state.socket,
                room: action.room,
                player: state.player,
                roomList: state.roomList
            }
        case ClientStateActionType.SetPlayer:
            return {
                socket: state.socket,
                room: state.room,
                player: action.player,
                roomList: state.roomList
            };
        case ClientStateActionType.SetRoomList:
            return {
                socket: state.socket,
                room: state.room,
                player: state.player,
                roomList: action.roomList
            };
        default:
            throw new Error("Action type not found for clientStateReducer!");
    }
}

export type ClientStateDispatch = React.Dispatch<ClientStateAction>;

export const useClientState = (): [ClientState, ClientStateDispatch] => {
    return useReducer(clientStateReducer, initClientState);
}

