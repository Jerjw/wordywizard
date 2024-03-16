import { Dimensions } from 'react-native'
import Matter from "matter-js";
import { generateRandomNumber, getPipeSizePosPair } from "./utils/random";

const windowWidth = Dimensions.get('window').width

const Physics = (entities, {touches, time, dispatch}) => {
    let engine = entities.physics.engine

    touches.filter(t => t.type === 'press')
    .forEach(t => {
        Matter.Body.setVelocity(entities.Wizard.body, {
            x: 0,
            y: -4
        })
    })

    const MAX_OBSTACLES = 2; // You can adjust this based on your needs

    for (let index = 1; index <= MAX_OBSTACLES; index++) {
        const obstacleTopKey = `ObstacleTop${index}`;
        const obstacleBtmKey = `ObstacleBtm${index}`;

        // Check if the obstacle has passed a certain point and assign points
        if (entities[obstacleTopKey].body.bounds.max.x <= 50 && !entities[obstacleTopKey].point) {
            entities[obstacleTopKey].point = true;
            dispatch({ type: 'new_point' });
            let random = generateRandomNumber();
            //console.log(random);
            if(random == 2) {
                dispatch({ type: 'wordle' });
            } else if (random == 3) {
                dispatch({ type: '4word1pic' });
            }
        }

        // Reset the position if the obstacle has moved out of the screen
        if (entities[obstacleTopKey].body.bounds.max.x <= 0) {
            const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);

            Matter.Body.setPosition(entities[obstacleTopKey].body, pipeSizePos.pipeTop.pos);
            Matter.Body.setPosition(entities[obstacleBtmKey].body, pipeSizePos.pipeBottom.pos);

            entities[obstacleTopKey].point = false;
        }

        // Move the obstacles
        Matter.Body.translate(entities[obstacleTopKey].body, { x: -3, y: 0 });
        Matter.Body.translate(entities[obstacleBtmKey].body, { x: -3, y: 0 });
    }

    Matter.Engine.update(engine, time.delta)

    Matter.Events.on(engine, 'collisionStart', (event) => {
        dispatch({ type: 'game_over' })
      })

    return entities;
}
export default Physics