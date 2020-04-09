import { useReducer } from 'react';

import { Viewport, MousePosition } from './GameData';

interface GameState {
    viewport: Viewport,
    mousePosition: MousePosition
}

export enum GameStateActionType {
    MoveViewport,
    ZoomViewport,
    SetMousePosition
}

interface MoveViewportAction {
    type: GameStateActionType.MoveViewport,
    dx: number,
    dy: number
}

interface ZoomViewportAction {
    type: GameStateActionType.ZoomViewport,
    out: boolean
}

interface SetMousePositionAction {
    type: GameStateActionType.SetMousePosition,
    mousePosition: MousePosition
}

type GameStateAction = MoveViewportAction | ZoomViewportAction | SetMousePositionAction;

const initGameState: GameState = {
    viewport: {
        x: 0,
        y: 0,
        d: 100
    },
    mousePosition: {
        x: 0,
        y: 0
    }
};

const gameStateReducer = (state: GameState, action: GameStateAction): GameState => {
    switch (action.type) {
        case GameStateActionType.MoveViewport:
            return {
                viewport: {
                    x: state.viewport.x + action.dx * state.viewport.d / Math.min(window.innerWidth, window.innerHeight),
                    y: state.viewport.y + action.dy * state.viewport.d / Math.min(window.innerWidth, window.innerHeight),
                    d: state.viewport.d
                },
                mousePosition: state.mousePosition
            }
        case GameStateActionType.ZoomViewport:
            const f = Math.pow(1.15, action.out ? 1 : -1);
            return {
                viewport: {
                    x: state.viewport.x + (state.mousePosition.x - window.innerWidth / 2) / Math.min(window.innerWidth, window.innerHeight) * state.viewport.d * (1 - f),
                    y: state.viewport.y + (state.mousePosition.y - window.innerHeight / 2) / Math.min(window.innerWidth, window.innerHeight) * state.viewport.d * (1 - f),
                    d: state.viewport.d * f
                },
                mousePosition: state.mousePosition
            }
        case GameStateActionType.SetMousePosition:
            return {
                viewport: state.viewport,
                mousePosition: action.mousePosition
            }
        default:
            throw new Error("Action type not found for gameStateReducer!")
    }
}

export type GameStateDispatch = React.Dispatch<GameStateAction>

export const useGameState = (): [GameState, GameStateDispatch] => {
    return useReducer(gameStateReducer, initGameState);
}
