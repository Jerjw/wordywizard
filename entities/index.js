import Matter from "matter-js"
import wizard from "../components/Wizard";
import Floor from "../components/Floor";

import { Dimensions } from "react-native";
import Obstacle from "../components/Obstacle";
import { getPipeSizePosPair } from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const pipeSizePosA = getPipeSizePosPair()
const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9)

export default () => {
    let engine = Matter.Engine.create({
      enableSleeping: false
    })
  
    let world = engine.world
  
    engine.gravity.y = 0.4

    return {
      physics: { engine, world },
      Wizard: wizard(world, 'blue', { x: 50, y: 300 }, { height: 50, width: 50 }),

      ObstacleTop1: Obstacle(world, 'ObstacleTop1', 'red', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
      ObstacleBtm1: Obstacle(world, 'ObstacleBtm1', 'red', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),

      ObstacleTop2: Obstacle(world, 'ObstacleTop2', 'red', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size),
      ObstacleBtm2: Obstacle(world, 'ObstacleBtm2', 'red', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size),
      
      Floor: Floor(world, 'green', { x: windowWidth/2, y: windowHeight }, { height: 70, width: windowWidth }),
    }
}