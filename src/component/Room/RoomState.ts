import { useReducer } from 'react';

import { Viewport } from 'component/Game/GameData';

interface RoomState {
    nodeHoveredID: number | undefined,
    nodeSelectedID: number | undefined,
    mouseDown: boolean,
    viewport: Viewport
}

export enum RoomStateActionType {
    SetNodeHoveredID,
    SetNodeSelectedID,
    SetMouseDown,
    MoveViewport
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

interface MoveViewportAction {
    type: RoomStateActionType.MoveViewport,
    dx: number,
    dy: number,
    md: number
}

type RoomStateAction = SetNodeHoveredIDAction | SetNodeSelectedIDAction | SetMouseDownAction | MoveViewportAction;

const initRoomState: RoomState = {
    nodeHoveredID: undefined,
    nodeSelectedID: undefined,
    mouseDown: false,
    viewport: {
        x: 0,
        y: 0,
        d: 100
    }
};

const roomStateReducer = (state: RoomState, action: RoomStateAction): RoomState => {
    switch (action.type) {
        case RoomStateActionType.SetNodeHoveredID:
            return {
                nodeHoveredID: action.nodeHoveredID,
                nodeSelectedID: state.nodeSelectedID,
                mouseDown: state.mouseDown,
                viewport: state.viewport
            }
        case RoomStateActionType.SetNodeSelectedID:
            return {
                nodeHoveredID: state.nodeHoveredID,
                nodeSelectedID: action.nodeSelectedID,
                mouseDown: state.mouseDown,
                viewport: state.viewport
            }
        case RoomStateActionType.SetMouseDown:
            return {
                nodeHoveredID: state.nodeHoveredID,
                nodeSelectedID: state.nodeSelectedID,
                mouseDown: action.mouseDown,
                viewport: state.viewport
            }
        case RoomStateActionType.MoveViewport:
            console.log(action.md);
            console.log(state.viewport.d * action.md);
            return {
                nodeHoveredID: state.nodeHoveredID,
                nodeSelectedID: state.nodeSelectedID,
                mouseDown: state.mouseDown,
                viewport: {
                    x: state.viewport.x + action.dx * state.viewport.d / Math.min(window.innerWidth, window.innerHeight),
                    y: state.viewport.y + action.dy * state.viewport.d / Math.min(window.innerWidth, window.innerHeight),
                    d: state.viewport.d * action.md
                }
            }
        default:
            throw new Error("Action type not found for roomStateReducer!")
    }
}

export type RoomStateDispatch = React.Dispatch<RoomStateAction>

export const useRoomState = (): [RoomState, RoomStateDispatch] => {
    return useReducer(roomStateReducer, initRoomState);
}
