import Matter from 'matter-js';
import React from 'react';
import { Image, View } from 'react-native';

import WIZARD from '../assets/wizard.png';

const Wizard = (props) => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;

  const color = props.color;

  return (
    <Image
        source={WIZARD}
      style={{
        position: 'absolute',
        left: xBody,
        top: yBody,
        width: widthBody,
        height: heightBody,
        resizeMode: 'contain'
      }}
    />
  );
};

export default (world, color, pos, size) => {
  const initialWizard = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    { label: 'Wizard' }
  );
  Matter.World.add(world, initialWizard);

  return {
    body: initialWizard,
    color,
    pos,
    renderer: <Wizard />,
  };
};
