import { Dimensions } from 'react-native'
import { fourPic1Words, wordList } from '../constants'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const selectRandomWord =() => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

export const getRandom4Pics = () => {
    const randomIndex = Math.floor(Math.random() * fourPic1Words.length);
    return fourPic1Words[randomIndex];
  };

export const generateRandomNumber = () => {
    // Generate a random decimal between 0 and 1
    const randomDecimal = Math.random();

    // Scale and shift the random decimal to the desired range (1 to 3)
    const randomNumber = Math.round(randomDecimal * 3) + 1;

    return randomNumber;
}

export const getPipeSizePosPair = (addToPosX = 0) => {
    let yPosTop = -getRandom(300, windowHeight - 100)

    const pipeTop = { pos: { x: windowWidth + addToPosX, y: yPosTop }, size: { height: windowHeight * 2, width: 75 } }
    const pipeBottom = { pos: { x: windowWidth + addToPosX, y: windowHeight * 2 + 200 + yPosTop }, size: { height: windowHeight * 2, width: 75 } }

    return { pipeTop, pipeBottom }
}
