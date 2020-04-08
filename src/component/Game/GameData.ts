import { MapData, MapDataFlat } from 'component/Map/MapData';
import { MapArmyData, MapArmyDataFlat } from 'component/Map/MapArmy/MapArmyData';

// Data interface for Game
export interface GameData {
    map: MapData,
    armies: MapArmyData[]
}

// Non-recursive data interface for Game
export interface GameDataFlat {
    map: MapDataFlat,
    armies: MapArmyDataFlat[]
}

// Viewport data
export interface Viewport {
    x: number,
    y: number,
    d: number
}