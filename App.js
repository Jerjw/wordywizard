import { StatusBar } from 'expo-status-bar';
import { Alert, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics';
import { useEffect, useState } from 'react';
import Keyboard from './components/Keyboard';
import { CLEAR, ENTER, colors, threeLetter, wordList } from './constants';
import { getRandom4Pics, selectRandomWord } from './utils/random';

const NUMBER_OF_TRIES = 5;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export default function App() {
  const [running, setRunning] = useState(false);
  const [puzzleShow, setPuzzleShow] = useState('');
  const [gameEngine, setGameEngine] = useState(null);
  const [points, setPoints] = useState(0);
  const [letters, setLetters] = useState(selectRandomWord().split(''));
  const [fourPics1Word, setFourPics1Word] = useState(getRandom4Pics());
  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [fourPicText, setFourPicText] = useState('');

  const fourPicsSubmit = () => {
    if(fourPicText === fourPics1Word.word) {
      Alert.alert("You are correct!!", undefined, [
        {
          text: "OK",
          onPress: () => {
            // User clicked "OK", execute the following code
            setRunning(true);
            setPuzzleShow(false);
            setPoints(points + 2);

            setFourPicText('');
          }
        }
      ]);
    } else if (fourPicText !== fourPics1Word.word) {
      Alert.alert("You are wrong!!", undefined, [
        {
          text: "OK",
          onPress: () => {
            // User clicked "OK", execute the following code
            setRunning(false);
            setPuzzleShow(false);
            setPoints(0);
            gameEngine.stop();
          }
        }
      ]);
    }
  }

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows);

    if(key === CLEAR) {
      const prevCol = curCol - 1;
      if(prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if(key === ENTER) {
      if(curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }

    if(curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, cell) => {
    return row === curRow && curCol === cell;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if(row >= curRow) {
      return "#e3ac5f";
    }
    if(letter === letters[col]) {
      return colors.primary;
    }
    if(letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => row.filter((cell, j) => getCellBGColor(i, j) === color));
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  useEffect(() => {
    if(curRow > 0) {
      checkWordleGameState();
    }
  }, [curRow])

  const checkWordleGameState = () => {
    if(checkIfWon()) {
      Alert.alert("You are correct!!", undefined, [
        {
          text: "OK",
          onPress: () => {
            // User clicked "OK", execute the following code
            setRunning(true);
            setPuzzleShow(false);
            setPoints(points + 2);
    
            // Reset the rows state
            const initialRows = new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''));
            setRows(initialRows);
    
            // Reset other state variables if needed
            setCurCol(0);
            setCurRow(0);
          }
        }
      ]);
    } else if (checkIfLost()) {
      Alert.alert("You are wrong!!", undefined, [
        {
          text: "OK",
          onPress: () => {
            // User clicked "OK", execute the following code
            setRunning(false);
            setPuzzleShow(false);
            setPoints(0);
            gameEngine.stop();
            // Reset the rows state
            const initialRows = new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''));
            setRows(initialRows);
    
            // Reset other state variables if needed
            setCurCol(0);
            setCurRow(0);
          }
        }
      ]);
    }
  }

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  }

  const checkIfLost = () => {
    return curRow === rows.length;
  }

  useEffect(() => {
    setRunning(false);
  }, [])
  return (
    <View className="flex-1 bg-white">
      <Text className="z-10 text-center text-3xl font-bold mt-10">{points}</Text>
      <GameEngine
      ref={(ref) => {setGameEngine(ref)}}
      systems={[Physics]} 
      entities={entities()}
      running={running}
      onEvent={(e) => {
        switch (e.type) {
          case 'game_over':
            setRunning(false)
            gameEngine.stop()
            setPoints(0)
            break;
          case 'new_point':
            setPoints(points + 1)
            break;
          case 'wordle':
            setRunning(false);
            setPuzzleShow('wordle');
            setLetters(selectRandomWord().split(''));
            break;
          case '4word1pic':
            setRunning(false);
            setFourPics1Word(getRandom4Pics());
            setPuzzleShow('4word1pic');
            break;
        }
      }}
      className="absolute top-0 left-0 right-0 bottom-0">
        <StatusBar style="auto" hidden={true}/>
      </GameEngine>
      {!running ?
        <View className="flex-1 justify-center items-center">
          <TouchableOpacity className="bg-black px-8 py-3" onPress={() => {
            setPoints(0)
            setRunning(true)
            setPuzzleShow(false);
            gameEngine.swap(entities())
          }}>
            <Text className="font-bold text-white text-3xl">START GAME</Text>
          </TouchableOpacity>
        </View> : null
      }
      {puzzleShow === 'wordle' ? 
      <View className="absolute top-44 left-6 transform flex justify-center items-center bg-[#e3ac5f] w-96 h-2/3">
        <Text className="font-bold text-xl mt-2">Wordle</Text>
        <View className="self-stretch h-[100px] mt-5">
          {rows.map((row, i) => (
            <View key={`row-${i}`} className="self-stretch flex flex-row">
              {row.map((cell, j) => (
                <View key={`cell-${i}-${j}`} 
                className={`border flex-1 aspect-square m-1 justify-center items-center 
                ${isCellActive(i, j) ? 'border-white' : 'border-black'}`} style={{ backgroundColor: getCellBGColor(i, j) }}>
                  <Text className="font-bold text-3xl text-white">{cell.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          ))}
          
        </View>
        <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={yellowCaps} greyCaps={greyCaps}/>
      </View> : puzzleShow === '4word1pic' ?
      <View className="absolute top-44 left-6 transform flex items-center bg-[#e3ac5f] w-96 h-2/3">
        <Text className="font-bold text-xl mt-6">4 Pics 1 Word</Text>
        <Image source={fourPics1Word.picture} className='mt-20 w-60 h-60'/>
        <TextInput
          placeholder="Type your answer" className='mt-8 w-[70%] text-3xl bg-red-100 rounded-xl' onChangeText={(text) => setFourPicText(text.toLowerCase())}/>
        <TouchableOpacity className="bg-white px-8 py-3 absolute bottom-6" onPress={() => {
            fourPicsSubmit();
          }}>
            <Text className="font-bold text-black text-3xl">Submit</Text>
          </TouchableOpacity>
      </View> : null
      }
    </View>
  );
}
