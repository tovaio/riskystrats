import { RoomSummaryData } from 'component/Lobby/LobbyData';
import { GameData, GameDataFlat } from 'component/Game/GameData';

import { MapNodeData } from 'component/Map/MapNode/MapNodeData';
import { MapArmyData } from 'component/Map/MapArmy/MapArmyData';

import { PlayerData } from 'component/Player/PlayerData';

// Data interface for Room
export interface RoomData {
    game: GameData | undefined,
    players: PlayerData[],
    spectators: PlayerData[],
    summary: RoomSummaryData
}

// Non-recursive data interface for Room
export interface RoomDataFlat {
    game: GameDataFlat | undefined,
    players: PlayerData[],
    spectators: PlayerData[],
    summary: RoomSummaryData
}

export const unflattenRoom = (flatRoom: RoomDataFlat): RoomData => {
    if (flatRoom.game === undefined) {
        return {
            game: undefined,
            players: flatRoom.players,
            spectators: flatRoom.spectators,
            summary: flatRoom.summary
        }
    }

    const flatMap = flatRoom.game.map;

    const nodes: MapNodeData[] = flatMap.nodes.map(flatNode => ({
        x: flatNode.x,
        y: flatNode.y,
        id: flatNode.id,
        adj: [],
        team: flatNode.team,
        troops: flatNode.troops,
        type: flatNode.type,
        assign: undefined
    }));

    for (let flatNode of flatMap.nodes) {
        const node = nodes[flatNode.id];
        for (let adjID of flatNode.adj) {
            node.adj.push(nodes[adjID]);
        }
        node.assign = flatNode.assign >= 0 ? nodes[flatNode.assign] : undefined;
    }

    const armies: MapArmyData[] = flatRoom.game.armies.map(flatArmy => ({
        from: nodes[flatArmy.from],
        to: nodes[flatArmy.to],
        troops: flatArmy.troops,
        distance: flatArmy.distance,
        team: flatArmy.team,
        id: flatArmy.id
    }));

    return {
        game: {
            map: {
                nodes: nodes,
                edges: flatMap.edges.map(([nodeID1, nodeID2]) => [nodes[nodeID1], nodes[nodeID2]])
            },
            armies: armies
        },
        players: flatRoom.players,
        spectators: flatRoom.spectators,
        summary: flatRoom.summary
    }
}