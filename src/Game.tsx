import React from 'react';

import { Team } from './Player';

import Map, { MapData, MapDataFlat } from './Map/Map';
import MapArmy, { MapArmyData, MapArmyDataFlat } from './Map/MapArmy';
import { MapNodeData } from './Map/MapNode';

interface GameProps {
    game: GameData,
    team: Team,
    nodeHoveredID?: number,
    nodeSelectedID?: number,
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
    const armies = props.game.armies.map(army => (
        <MapArmy
            army = {army}
            team = {props.team}
            key = {`army_${army.id}`}
        />
    ));

    return (
        <div className="map">
            <Map
                map = {props.game.map}
                team = {props.team}
                nodeHoveredID = {props.nodeHoveredID}
                nodeSelectedID = {props.nodeSelectedID}
                onMouseEnterNode = {props.onMouseEnterNode}
                onMouseLeaveNode = {props.onMouseLeaveNode}
            />
            {armies}
        </div>
    );
}

export default Game;

export interface GameData {
    map: MapData,
    armies: MapArmyData[]
}

export interface GameDataFlat {
    map: MapDataFlat,
    armies: MapArmyDataFlat[]
}