/*
    Collection of utility functions and constants
*/

import { Team } from 'component/Player/PlayerData';

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