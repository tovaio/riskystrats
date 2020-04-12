import React, { useEffect } from 'react';
import gsap from 'gsap';

import { MapNodeData } from 'component/Map/MapNode/MapNodeData';

import { nodeRadius } from 'style/Constants';
import style from './SelectedCircle.module.scss';

interface SelectedCircleProps {
    node: MapNodeData,
    color?: string
}

const SelectedCircle: React.FC<SelectedCircleProps> = props => {
    const radiusFactor = 1.4;
    const maxScale = 1.1;

    useEffect(
        () => {
            const tl = gsap.timeline({repeat: -1});
            const rotationTime = 10;
            const pulsesPerRotation = 8;

            for (let i = 0; i < pulsesPerRotation; i++) {
                tl.to(`.selected-node-${props.node.id}`, rotationTime / 2 / pulsesPerRotation, {
                    scale: maxScale,
                    opacity: 1,
                    ease: 'power1.inOut'
                }, ">");
                tl.to(`.selected-node-${props.node.id}`, rotationTime / 2 / pulsesPerRotation, {
                    scale: 1,
                    opacity: 1,
                    ease: 'power1.inOut'
                }, ">");
            }

            tl.fromTo(`.selected-node-${props.node.id}`, rotationTime, {
                rotate: '0deg',
                ease: 'none'
            }, {
                rotate: '360deg',
                ease: 'none'
            }, 0);

            return () => {
                tl.kill();
            };
        },
        []
    );

    return (
        <circle
            className = {`${style.selectedCircle} selected-node-${props.node.id}`}

            cx = {props.node.x}
            cy = {props.node.y}
            r = {nodeRadius * radiusFactor}

            strokeDasharray = {nodeRadius * radiusFactor * Math.PI / 10}
            pointerEvents = 'visiblePainted'

            style = {props.color !== undefined ? {stroke: props.color} : {}}
        />
    );
}

export default SelectedCircle;
