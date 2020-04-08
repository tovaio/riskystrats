import React from 'react';

import { GameData, Viewport } from './GameData';

import Map from 'component/Map/Map';
import MapArmy from 'component/Map/MapArmy/MapArmy'
import { MapNodeData } from 'component/Map/MapNode/MapNodeData';

import { Team } from 'component/Player/PlayerData';

// Properties for Game component
interface GameProps {
    game: GameData,
    team: Team,
    nodeHoveredID?: number,
    nodeSelectedID?: number,
    viewport?: Viewport,
    onMouseEnterNode?: (node: MapNodeData) => void,
    onMouseLeaveNode?: (node: MapNodeData) => void
}

/*
    Game:
    React component that renders a game of riskystrats.
    It is client-agnostic, meaning that you can use this component to render views of riskystrats games without interaction.
    (one particular example of this is for visualizing replays of games, viewing AI play each other, etc.)
*/
const Game: React.FC<GameProps> = props => {
    const viewport: Viewport = props.viewport || {
        x: -50,
        y: -50,
        d: 100
    }

    const armies = props.game.armies.map(army => (
        <MapArmy
            army = {army}
            team = {props.team}
            key = {`army_${army.id}`}
        />
    ));

    return (
        <div className="game">
            <svg
                width = "100%"
                height = "100%"
                viewBox = {`${viewport.x - viewport.d / 2} ${viewport.y - viewport.d / 2} ${viewport.d} ${viewport.d}`}
                style = {{
                    transition: 'all 0.5s'
                }}
            >
                <Map
                    map = {props.game.map}
                    team = {props.team}
                    nodeHoveredID = {props.nodeHoveredID}
                    nodeSelectedID = {props.nodeSelectedID}
                    onMouseEnterNode = {props.onMouseEnterNode}
                    onMouseLeaveNode = {props.onMouseLeaveNode}
                />
                {armies}
            </svg>
        </div>
    );
}

export default Game;