import { useReducer } from 'react';

interface RoomState {
    nodeHoveredID: number | undefined,
    nodeSelectedID: number | undefined,
    mouseDown: boolean
}

export enum RoomStateActionType {
    SetNodeHoveredID,
    SetNodeSelectedID,
    SetMouseDown
}

interface SetNodeHoveredIDAction {
    type: RoomStateActionType.SetNodeHoveredID,
    nodeHoveredID: number | undefined
}

interface SetNodeSelectedIDAction {
    type: RoomStateActionType.SetNodeSelectedID,
    nodeSelectedID: number | undefined
}

interface SetMouseDownAction {
    type: RoomStateActionType.SetMouseDown,
    mouseDown: boolean
}

type RoomStateAction = SetNodeHoveredIDAction | SetNodeSelectedIDAction | SetMouseDownAction;

const initRoomState: RoomState = {
    nodeHoveredID: undefined,
    nodeSelectedID: undefined,
    mouseDown: false
};

const roomStateReducer = (state: RoomState, action: RoomStateAction): RoomState => {
    switch (action.type) {
        case RoomStateActionType.SetNodeHoveredID:
            return {
                nodeHoveredID: action.nodeHoveredID,
                nodeSelectedID: state.nodeSelectedID,
                mouseDown: state.mouseDown
            }
        case RoomStateActionType.SetNodeSelectedID:
            return {
                nodeHoveredID: state.nodeHoveredID,
                nodeSelectedID: action.nodeSelectedID,
                mouseDown: state.mouseDown
            }
        case RoomStateActionType.SetMouseDown:
            return {
                nodeHoveredID: state.nodeHoveredID,
                nodeSelectedID: state.nodeSelectedID,
                mouseDown: action.mouseDown
            }
        default:
            throw new Error("Action type not found for roomStateReducer!")
    }
}

export type RoomStateDispatch = React.Dispatch<RoomStateAction>

export const useRoomState = (): [RoomState, RoomStateDispatch] => {
    return useReducer(roomStateReducer, initRoomState);
}
