import { useReducer } from 'react';

interface RoomState {
    nodeHoveredID: number | undefined,
    nodeSelectedID: number | undefined
}

export enum RoomStateActionType {
    SetNodeHoveredID,
    SetNodeSelectedID
}

interface SetNodeHoveredIDAction {
    type: RoomStateActionType.SetNodeHoveredID,
    nodeHoveredID: number | undefined
}

interface SetNodeSelectedIDAction {
    type: RoomStateActionType.SetNodeSelectedID,
    nodeSelectedID: number | undefined
}

type RoomStateAction = SetNodeHoveredIDAction | SetNodeSelectedIDAction;

const initRoomState: RoomState = {
    nodeHoveredID: undefined,
    nodeSelectedID: undefined
};

const roomStateReducer = (state: RoomState, action: RoomStateAction): RoomState => {
    switch (action.type) {
        case RoomStateActionType.SetNodeHoveredID:
            return {
                nodeHoveredID: action.nodeHoveredID,
                nodeSelectedID: state.nodeSelectedID
            }
        case RoomStateActionType.SetNodeSelectedID:
            return {
                nodeHoveredID: state.nodeHoveredID,
                nodeSelectedID: action.nodeSelectedID
            }
        default:
            throw new Error("Action type not found for roomStateReducer!")
    }
}

export type RoomStateDispatch = React.Dispatch<RoomStateAction>

export const useRoomState = (): [RoomState, RoomStateDispatch] => {
    return useReducer(roomStateReducer, initRoomState);
}
