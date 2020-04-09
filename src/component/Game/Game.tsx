import React, { useEffect } from 'react';
import gsap from 'gsap';

import { GameData, Viewport, MousePosition } from './GameData';

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
    onMouseEnterNode?: (node: MapNodeData) => void,
    onMouseLeaveNode?: (node: MapNodeData) => void
}

// Finds [minX, maxX, minY, maxY] of all the nodes in a game's map
const findBounds = (game: GameData): [number, number, number, number] => {
    if (game.map.nodes.length === 0)
        return [-10, 10, -10, 10];

    let minX = game.map.nodes[0].x;
    let maxX = minX;
    let minY = game.map.nodes[0].y;
    let maxY = minY;

    for (let node of game.map.nodes) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    }

    return [minX-10, maxX+10, minY-10, maxY+10];
}

/*
    Game:
    React component that renders a game of riskystrats.
    It is client-agnostic, meaning that you can use this component to render views of riskystrats games without interaction.
    (one particular example of this is for visualizing replays of games, viewing AI play each other, etc.)
*/
const Game: React.FC<GameProps> = props => {
    // Determine the mininum / maximum zooming
    const [minX, maxX, minY, maxY] = findBounds(props.game);

    const maxD = Math.max(maxX - minX, maxY - minY);
    const minD = Math.min(20, maxD);

    // Bind event listeners
    useEffect(
        () => {
            let mousePosition: MousePosition = {
                x: 0,
                y: 0
            };

            let viewport: Viewport;

            const setViewport = (newViewport: Viewport) => {
                viewport = newViewport;
                gsap.to(
                    '#game-svg', 
                    {
                        attr: {
                            viewBox: `${viewport.x - viewport.d / 2} ${viewport.y - viewport.d / 2} ${viewport.d} ${viewport.d}`
                        },
                        duration: 0.25
                    }
                );
            }

            setViewport({
                x: (minX + maxX) / 2,
                y: (minY + maxY) / 2,
                d: (maxD + minD) / 2
            });

            const onMouseMove = (e: MouseEvent) => {
                mousePosition = {
                    x: e.clientX,
                    y: e.clientY
                };
    
                const buttons = e.buttons || e.which;
                if ((buttons & 1) === 1) { // LMB down
                    setViewport({
                        x: Math.min(Math.max(viewport.x - e.movementX * viewport.d / Math.min(window.innerWidth, window.innerHeight), minX + viewport.d/2), maxX - viewport.d/2),
                        y: Math.min(Math.max(viewport.y - e.movementY * viewport.d / Math.min(window.innerWidth, window.innerHeight), minY + viewport.d/2), maxY - viewport.d/2),
                        d: viewport.d
                    });
                }
            };

            const onMouseWheel = (e: WheelEvent) => {
                if ((viewport.d <= minD && e.deltaY < 0) || (viewport.d >= maxD && e.deltaY > 0))
                    return;
                const newD = Math.min(Math.max(viewport.d * Math.pow(1.2, (e.deltaY > 0) ? 1 : -1), minD), maxD);
                setViewport({
                    x: Math.min(Math.max(viewport.x + (mousePosition.x - window.innerWidth / 2) / Math.min(window.innerWidth, window.innerHeight) * (viewport.d - newD), minX + newD/2), maxX - newD/2),
                    y: Math.min(Math.max(viewport.y + (mousePosition.y - window.innerHeight / 2) / Math.min(window.innerWidth, window.innerHeight) * (viewport.d - newD), minY + newD/2), maxY - newD/2),
                    d: newD
                });
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('wheel', onMouseWheel);
            return () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('wheel', onMouseWheel);
            }
        },
        [minX, maxX, minY, maxY, maxD, minD]
    );

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
                id = "game-svg"
                width = "100%"
                height = "100%"
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