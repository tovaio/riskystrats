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
            const className = `.selected-node-${props.node.id}`;

            let tl: gsap.core.Timeline | undefined = undefined;

            const t = gsap.fromTo(className, 0.15, {
                transformOrigin: 'center center',
                opacity: 0,
                scale: 0.5
            }, {
                transformOrigin: 'center center',
                opacity: 1,
                scale: 1,
                ease: 'power1.out',
                onComplete: () => {
                    tl = gsap.timeline({repeat: -1});
                    const rotationTime = 10;
                    const pulsesPerRotation = 8;

                    for (let i = 0; i < pulsesPerRotation; i++) {
                        tl.to(className, rotationTime / 2 / pulsesPerRotation, {
                            scale: maxScale,
                            ease: 'power1.inOut'
                        }, ">");
                        tl.to(className, rotationTime / 2 / pulsesPerRotation, {
                            scale: 1,
                            ease: 'power1.inOut'
                        }, ">");
                    }

                    tl.fromTo(className, rotationTime, {
                        rotate: '0deg',
                        ease: 'none'
                    }, {
                        rotate: '360deg',
                        ease: 'none'
                    }, 0);
                }
            });

            return () => {
                if (tl !== undefined)
                    tl.kill();
                t.kill();
            };
        },
        [props.node.id]
    );

    return (
        <circle
            className = {`${style.selectedCircle} selected-node-${props.node.id}`}

            cx = {props.node.x}
            cy = {props.node.y}
            r = {nodeRadius * radiusFactor}

            strokeDasharray = {nodeRadius * radiusFactor * Math.PI / 10}

            style = {props.color !== undefined ? {stroke: props.color} : {}}
        />
    );
}

export default SelectedCircle;
