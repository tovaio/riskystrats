import React from 'react';

import { NodeType } from './MapNodeData';

import { nodeRadius, edgeWidth } from 'style/Constants';
import style from './MapNode.module.scss';

interface MapNodeShapeProps {
    cx: number,
    cy: number,
    fill: string,
    stroke: string
}

const makeCircle = (cx: number, cy: number, r: number, css: React.CSSProperties) => (
    <circle
        className = {style.mapNodeCircle}

        // Position
        cx = {cx}
        cy = {cy}
        r = {r}

        // Colors
        style = {css}
    />
);

const makePolygon = (numCircles: number, props: React.PropsWithChildren<MapNodeShapeProps>) => {
    const miniRadius = nodeRadius / (1 + 1/Math.sin(Math.PI / numCircles));
    const angleFragment = 2 * Math.PI / numCircles;

    const elems = [];

    let d = "";

    for (let i = 0; i < numCircles; i++) {
        const angle = angleFragment * i
        const x = props.cx + Math.sin(angle) * miniRadius / Math.sin(angleFragment / 2);
        const y = props.cy - Math.cos(angle) * miniRadius / Math.sin(angleFragment / 2);
        elems.push(makeCircle(x, y, miniRadius, {
            fill: props.fill,
            stroke: props.stroke,
            strokeWidth: edgeWidth
        }));
        d += `${(i === 0) ? 'M' : 'L'} ${x},${y} `;
    }
    d += 'Z';

    elems.push((
        <path
            className = {style.mapNodeCircle}
            d = {d}
            fill = {props.fill}
            stroke = {props.fill}
            strokeWidth = {edgeWidth/2}
        />
    ));

    return (
        <>
            {elems}
        </>
    );
}

const MapNodeShape: Record<NodeType, React.FC<MapNodeShapeProps>> = {
    [NodeType.Normal]: props => makeCircle(props.cx, props.cy, nodeRadius, {
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: edgeWidth
    }),
    [NodeType.Factory]: props => makePolygon(2, props),
    [NodeType.PowerPlant]: props => makePolygon(3, props),
    [NodeType.Fort]: props => makePolygon(4, props),
    [NodeType.Artillery]: props => makePolygon(5, props),
};

export default MapNodeShape;