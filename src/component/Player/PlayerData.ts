export enum Team {
    Neutral,
    Red,
    Blue,
    Green,
    Yellow,
    Orange,
    Purple
}

export interface PlayerData {
    team: Team,
    name: string,
    id: number
}