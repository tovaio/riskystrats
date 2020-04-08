import { MapNodeData } from 'component/Map/MapNode/MapNodeData';
import { Team } from 'component/Player/PlayerData';

// Data interface for MapArmy
export interface MapArmyData {
    from: MapNodeData,
    to: MapNodeData,
    troops: number,
    distance: number,
    team: Team,
    id: number
}

// Non-recursive data interface for MapArmy
export interface MapArmyDataFlat {
    from: number,
    to: number,
    troops: number,
    distance: number,
    team: Team,
    id: number
}