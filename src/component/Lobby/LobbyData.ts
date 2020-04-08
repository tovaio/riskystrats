// Data interface for RoomSummary
export interface RoomSummaryData {
    name: string,
    id: string,
    nPlayers: number,
    maxPlayers: number,
    nSpectators: number
}

// Data interface for RoomList
export type RoomListData = RoomSummaryData[];