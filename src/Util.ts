/*
    Collection of utility functions and constants
*/

import { Team } from './Player';
import { RoomData, RoomDataFlat } from './Room';
import { MapNodeData } from './Map/MapNode';
import { MapArmyData } from './Map/MapArmy';

export const unflatten = (flatRoom: RoomDataFlat): RoomData => {
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

export const nodeColors = {
    [Team.Neutral]: '#444444',
    [Team.Red]: '#DD0000',
    [Team.Blue]: '#0000DD',
    [Team.Green]: '#00DD00',
    [Team.Yellow]: '#DDDD00',
    [Team.Orange]: '#DD7700',
    [Team.Purple]: '#7700DD'
};

export const nodeRadius = 2;
export const armyRadius = 1;
export const edgeWidth = 5/9;
export const scaleFactor = 1;

export const fontStack = "'Courier New', Courier, monospace";