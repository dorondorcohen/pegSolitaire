// count retries borads = 0 every game retry 

const MOVES = Object.freeze({
  LEFT: '<',
  RIGHT: '>',
  BOTTOM: '_',
  UP: '^',
})

const PIN_MOVE_COUNT = 2;
const START_POINT_OF_Y = 3;
const START_POINT_OF_X = 3;
const EMPTY_CAHR = '.';
const PIN_CAHR = '0';

class Game {
  copyOfBoard;
  dst;
  src;
  moves = [];
  isFirstMove = true;
  totalEmptyFieldsInDst;
  countBoardRetries = 0;
  countGameRetries = 0;
  memoryMoves = [];
  emptyPinsInPreviousMoved = null;
  gamesMoves = []

  init(dst) {
    if(!Array.isArray(dst)) {
      console.error('dst is not array...')
      return 
    }
    this.src = [' OOO ', ' OOO ', 'OOOOOOO', 'OOO.OOO', 'OOOOOOO', ' OOO ', ' OOO '].map(item => item.trim());
    this.copyOfBoard = Array.from(this.src);
    this.dst = dst.map(item => item.trim());
    this.totalEmptyFieldsInDst = this.getTotalEmptyFields(dst)

    this.loopOverBoard();
  }

  getTotalEmptyFields(board) {
    if(!board || !Array.isArray(board)) {
      console.error('The board is not exists...')
      return;
    }

    let countEmptyChars = 0
    for(let y = 0; y < board.length; y++) {
      const boardRow = board[y];
      
      for(let x = 0; x < this.src.length; x++) {
        if(boardRow[x] === EMPTY_CAHR) {
          countEmptyChars++
        }
      }
    }

    return countEmptyChars;
  }

  updateCopyOfBoard(x, y, moveType, retryBoardNumber) {
    switch(moveType) {
      case MOVES.LEFT:
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x - 1, EMPTY_CAHR);
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x - 2, PIN_CAHR);
      break;
      
      case MOVES.BOTTOM:
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
        this.copyOfBoard[y + 1] = this.copyOfBoard[y + 1].replaceAt(x, EMPTY_CAHR);
        this.copyOfBoard[y + 2] = this.copyOfBoard[y + 2].replaceAt(x, PIN_CAHR);
      break;

      case MOVES.UP:
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
        this.copyOfBoard[y - 1] = this.copyOfBoard[y - 1].replaceAt(x, EMPTY_CAHR);
        this.copyOfBoard[y - 2] = this.copyOfBoard[y - 2].replaceAt(x, PIN_CAHR);
      break;

      case MOVES.RIGHT:
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x + 1, EMPTY_CAHR);
        this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x + 2, PIN_CAHR);
      break;
    }
  }

  pushMoveToMemory(x, y, movetype, retryBoardNumber, isDone = false) {
    this.memoryMoves.push({
      x, 
      y,
      movetype,
      retryBoardNumber,
      moveWasDoneInGameRetryNumber: null,
      createdAtGameRetry: this.countGameRetries,
      isDone,
    })
  }

  setLastMoveInMemoryDone() {
    for(let i = this.memoryMoves.length - 1; i > 0; i--) {
      const item = this.memoryMoves[i];
      if(!item.isDone) {
        this.memoryMoves[i].isDone = true;
        this.memoryMoves[i].moveWasDoneInGameRetryNumber = this.countGameRetries;
        return;
      }
    }
  }

  isGameMovesEquals(movesToCheck = this.moves, equalTo = this.gamesMoves[this.countGameRetries]) {
      return false
  }

  isMoveInMemoryDone(x, y, moveType, retryBoardNumber) {
    for(let item of this.memoryMoves) {
      // item.moveWasDoneInGameRetryNumber < this.countGameRetries
      if(item.x == x && item.y == y && item.retryBoardNumber == retryBoardNumber && item.moveType == moveType && item.isDone) { 

        for (let gameMove of this.gamesMoves)
        if(this.isGameMovesEquals(gameMove, this.moves)) {

        }
        this.gamesMoves
        return true;
      }
    }

    return false;
  }

  loopOverBoard() {
    let y;
    let x;
    let lastMove;
    for(y = 0; y < this.src.length; y++) {
      const srcRow = this.src[y];
      let isMoved = false
      
      for(x = 0; x < srcRow.length; x++) {
          const availableMoves = this.getPinMoves(x, y, this.countBoardRetries)

          if(availableMoves[MOVES.LEFT] && !this.isMoveInMemoryDone(x, y, MOVES.LEFT, this.countBoardRetries)) {
            this.updateCopyOfBoard(x, y, MOVES.LEFT, this.countBoardRetries)
            this.move(x, y, MOVES.LEFT)
            isMoved = true;
            lastMove = MOVES.LEFT;
            break;
          }

          if(availableMoves[MOVES.BOTTOM] && !this.isMoveInMemoryDone(x, y, MOVES.BOTTOM, this.countBoardRetries)) { 
            this.updateCopyOfBoard(x, y, MOVES.BOTTOM, this.countBoardRetries)
            this.move(x, y, MOVES.BOTTOM)
            isMoved = true;
            lastMove = MOVES.BOTTOM;
            break;
          }

          if(availableMoves[MOVES.UP] && !this.isMoveInMemoryDone(x, y, MOVES.UP, this.countBoardRetries)) {
            this.updateCopyOfBoard(x, y, MOVES.UP, this.countBoardRetries)
            this.move(x, y, MOVES.UP)
            isMoved = true;
            lastMove = MOVES.UP;
            break;
          }

          if(availableMoves[MOVES.RIGHT] && !this.isMoveInMemoryDone(x, y, MOVES.RIGHT, this.countBoardRetries)) {
            this.updateCopyOfBoard(x, y, MOVES.RIGHT, this.countBoardRetries)
            this.move(x, y, MOVES.RIGHT)
            isMoved = true;
            lastMove = MOVES.RIGHT;
            break;
          }
      }
      
      if(isMoved) {
        break;  
      }
    }

    if(this.memoryMoves.length > 2 && this.memoryMoves[0].isDone) {
      console.error('There no more moves to try....')
      return;
    }
    // this.countBoardRetries > 3000
    const TotalEmptyFieldsOfCopyBoard = this.getTotalEmptyFields(this.copyOfBoard);
    // console.log(this.src)
    console.log(this.copyOfBoard)
    console.log(`${TotalEmptyFieldsOfCopyBoard} === ${this.emptyPinsInPreviousMoved}`)
    if(TotalEmptyFieldsOfCopyBoard === this.emptyPinsInPreviousMoved && !this.isNewBoardEqualToDstBoard(this.copyOfBoard, this.dst)) {
      setTimeout(() => {
        this.gamesMoves[this.countGameRetries] = this.moves
        this.pushMoveToMemory(x, y, lastMove, this.countBoardRetries, false)
        this.setLastMoveInMemoryDone()
        this.resetGame();
        this.loopOverBoard();
      }, 5)
      return;
    }
    
    console.log(`${TotalEmptyFieldsOfCopyBoard} < ${this.totalEmptyFieldsInDst}`)
    console.log(this.memoryMoves)
    console.log(this.copyOfBoard)
    if(TotalEmptyFieldsOfCopyBoard <= this.totalEmptyFieldsInDst + 1) { 
      setTimeout(() => {
        console.log('this.countBoardRetries:', this.countBoardRetries)
        this.emptyPinsInPreviousMoved = TotalEmptyFieldsOfCopyBoard
        this.countBoardRetries++
        this.loopOverBoard();
        
      }, 5)
      return;
    }

    if(this.isNewBoardEqualToDstBoard()) {
      console.log('here')
      console.log(this.moves[this.countGameRetries])
    } else {
      console.log('Failed...')
      console.log(this.moves[this.countGameRetries])
    }
  }

  resetGame() {
    this.copyOfBoard = Array.from(this.src);
    this.countGameRetries++
    this.countBoardRetries = 0;
  }

  isNewBoardEqualToDstBoard(newBoard, dstBoard) {
    let isEqual = true;
    for(let y = 0; y < this.src.length; y++) {
      const copyOfBoard = newBoard[y];
      const dstRow = dstBoard[y];
      
      if(copyOfBoard[y] != dstRow[y]) {
        isEqual = false
        break;
      }
    }
    
    return isEqual;
  }

  getPinMoves(x, y, retryBoardNumber) {
    let availableMoves = {
      [MOVES.LEFT]: false,
      [MOVES.UP]: false,
      [MOVES.BOTTOM]: false,
      [MOVES.RIGHT]: false,
    }
    
    if(
        this.isValidBounds(x, y, MOVES.LEFT) &&
        !this.isTherePin(x - PIN_MOVE_COUNT, y) 
        // && (this.dst[y][x] == EMPTY_CAHR && this.dst[y][x - 1] == EMPTY_CAHR)
      ) {
      availableMoves[MOVES.LEFT] = true;
    }

    if(
      this.isValidBounds(x, y, MOVES.BOTTOM) &&
        !this.isTherePin(x, y + PIN_MOVE_COUNT) 
        // && (this.dst[y][x] == EMPTY_CAHR && this.dst[y + 1][x] == EMPTY_CAHR)
      ) {
      availableMoves[MOVES.BOTTOM] = true;
    }

    if(
      this.isValidBounds(x, y, MOVES.UP) && 
        !this.isTherePin(x, y - PIN_MOVE_COUNT) 
        // && (this.dst[y][x] == EMPTY_CAHR && this.dst[y - 1][x] == EMPTY_CAHR)
      ) {
      availableMoves[MOVES.UP] = true;
    }

    if(
      this.isValidBounds(x, y, MOVES.RIGHT) && 
        !this.isTherePin(x + PIN_MOVE_COUNT, y) 
        // && (this.dst[y][x] == EMPTY_CAHR && this.dst[y][x + 1] == EMPTY_CAHR)
      ) {
      availableMoves[MOVES.RIGHT] = true;
    }

    return availableMoves
  }

  isValidBounds(x, y, moveType) {
    let result = false;
    switch(moveType) {
      case MOVES.LEFT:
        if(this.copyOfBoard && this.copyOfBoard[y] && this.copyOfBoard[y][x - PIN_MOVE_COUNT]) {
          result = true
        }
      break;
      
      case MOVES.BOTTOM:
        if(this.copyOfBoard && this.copyOfBoard[y + PIN_MOVE_COUNT]) {
          result = true
        }
      break;

      case MOVES.UP:
        if(this.copyOfBoard && this.copyOfBoard[y - PIN_MOVE_COUNT]) {
          result = true
        }
      break;

      case MOVES.RIGHT:
        if(this.copyOfBoard && this.copyOfBoard[y] && this.copyOfBoard[y][x + PIN_MOVE_COUNT]) {
          result = true
        }
      break;
    }
    
    return result;
  }

  isTherePin(x, y) {
    return this.copyOfBoard[y][x] === PIN_CAHR;
  }

  move(x, y, moveType) {
    const move = [x, y, moveType];
    if(!this.moves[this.countGameRetries]) {
      this.moves[this.countGameRetries] = []
    }
    this.moves[this.countGameRetries].push(move);
  }

}


// OOO OOO OOOOOOO OOO.OOO OOOOOOO OOO OOO OOO OOO OOOOOOO O..OOOO OOOOOOO OOO OOO 
// [1, 3, '>'] ------------- 
// OOO OOO OOOOOOO OOO.OOO OOOOOOO OOO OOO OOO O.O OOO.OOO OOOOOOO OOOOOOO OOO OOO 
// [3, 1, 'v'] ------------ Input ------------ 
// this.src:  
// this.dst: 
// ------- Desired Output ----------- 
// [[1, 3, '>'] , [4, 3, '<'].....] 

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const game = new Game();
try {
  game.init(
    // [' OOO ', ' OOO ', 'O.O.OOO', 'OOO..OO', '..O.OOO', ' O.O ', ' OOO '],
    [
       ' OOO ',
       ' 0OO ', 
      'O000OOO', 
      'O0000OO', 
      'O0O0..O', 
       ' O.O ', 
       ' OOO ']
       // UP, RIGHT  
    // [' OOO ', ' OOO ', 'O0O0OOO', 'O00.0OO', 'O0O0OOO', ' O0O ', ' OOO '] 
  )
} catch(e) {
  console.log(game.moves[this.countGameRetries], e)
}

// [              
//   ' OOO ',        ' OOO ',
//   ' OOO ',        ' OOO ', 
//  'OOOOOOO',      'O.O.OOO', 
//  'OOO.00O',      'OOO..OO', 
//  'OOOOOOO',      '..O.OOO', 
//   ' OOO ',        ' O.O ', 
//   ' OOO '         ' OOO '
// ]

//   ' OOO ',
//   ' OOO ',   
//  'O0OOOO',  
//  'OOO..OO',  
//  '00O0OOO',  
//   ' O0O ',  
//   ' OOO ' 

