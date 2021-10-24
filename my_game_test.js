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
  const PIN_CAHR = 'O';
//   0
  
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
    emptyPinsInPreviousMoved = 1;
    gamesMoves = []
    gameMoveStack = []
  
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
      let moveToStack = {
        x: x,
        y: y,
        moveType: moveType,
        copyOfBoard: Array.from(this.copyOfBoard), 
        copyOfBoardAfterMove: null, 
        retryBoardNumber,
        emptyPinsInPreviousMoved: this.getTotalEmptyFields(this.copyOfBoard),
      }
      this.pushMoveToMemory(x, y, moveType, retryBoardNumber);
       
      switch(moveType) {
        case MOVES.LEFT:
          this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
          this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x - 1, EMPTY_CAHR);
          this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x - 2, PIN_CAHR);
        break;
        
        case MOVES.BOTTOM:
          switch(y) {
            case 0:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 1] = this.copyOfBoard[y + 1].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 2] = this.copyOfBoard[y + 2].replaceAt(x + 2, PIN_CAHR);
            break;

            case 1:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 1] = this.copyOfBoard[y + 1].replaceAt(x + 2, EMPTY_CAHR);
              this.copyOfBoard[y + 2] = this.copyOfBoard[y + 2].replaceAt(x + 2, PIN_CAHR);
            break;

            case 3:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 1] = this.copyOfBoard[y + 1].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 2] = this.copyOfBoard[y + 2].replaceAt(x - 2, PIN_CAHR);
            break;

            case 4:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 1] = this.copyOfBoard[y + 1].replaceAt(x - 2, EMPTY_CAHR);
              this.copyOfBoard[y + 2] = this.copyOfBoard[y + 2].replaceAt(x - 2, PIN_CAHR);
            break;

            default:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 1] = this.copyOfBoard[y + 1].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y + 2] = this.copyOfBoard[y + 2].replaceAt(x, PIN_CAHR);
          }
        break;
  
        case MOVES.UP:
          switch(y) {
            case 2:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 1] = this.copyOfBoard[y - 1].replaceAt(x - 2, EMPTY_CAHR);
              this.copyOfBoard[y - 2] = this.copyOfBoard[y - 2].replaceAt(x - 2, PIN_CAHR);
            break;

            case 3:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 1] = this.copyOfBoard[y - 1].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 2] = this.copyOfBoard[y - 2].replaceAt(x - 2, PIN_CAHR);
            break;

            case 5:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 1] = this.copyOfBoard[y - 1].replaceAt(x + 2, EMPTY_CAHR);
              this.copyOfBoard[y - 2] = this.copyOfBoard[y - 2].replaceAt(x + 2, PIN_CAHR);
            break;

            case 6:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 1] = this.copyOfBoard[y - 1].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 2] = this.copyOfBoard[y - 2].replaceAt(x + 2, PIN_CAHR);
            break;

            default:
              this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 1] = this.copyOfBoard[y - 1].replaceAt(x, EMPTY_CAHR);
              this.copyOfBoard[y - 2] = this.copyOfBoard[y - 2].replaceAt(x, PIN_CAHR);
          }
        break;
  
        case MOVES.RIGHT:
          this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x, EMPTY_CAHR);
          this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x + 1, EMPTY_CAHR);
          this.copyOfBoard[y] = this.copyOfBoard[y].replaceAt(x + 2, PIN_CAHR);
        break;
      }
      moveToStack.copyOfBoardAfterMove = Array.from(this.copyOfBoard), 
      this.gameMoveStack.push(moveToStack)
    }
  
    pushMoveToMemory(x, y, movetype, retryBoardNumber, isDone = false) {
        let index = this.calcIndexInMemory(x, y, retryBoardNumber);
        if(!this.memoryMoves[index]) {
            this.memoryMoves[index] = {
                [MOVES.LEFT]: false,
                [MOVES.RIGHT]: false,
                [MOVES.UP]: false,
                [MOVES.BOTTOM]: false,
            }
        }

        this.memoryMoves[index][movetype] = true;
    }
    
    calcIndexInMemory(x, y, retryBoardNumber) {
        return String(x) + String(y) + String(retryBoardNumber);
    }
    
    isMoveInExistsMemory(x, y, moveType, retryBoardNumber) {
        let index = this.calcIndexInMemory(x, y, retryBoardNumber);
        return (this.memoryMoves[index] && this.memoryMoves[index][moveType])
    }
  
    loopOverBoard() {
      let y;
      let x;
      let lastMoveType;
      let availableMoves;
      for(y = 0; y < this.src.length; y++) {
        const srcRow = this.src[y];
        let xLength = srcRow.length;
        let isMoved = false

        for(x = 0; x < xLength; x++) {
            if(this.copyOfBoard[y][x] == EMPTY_CAHR) {
                continue;
            }

            availableMoves = this.getPinMoves(x, y, this.countBoardRetries)
            // console.log(`availableMoves in x: ${x}, y: ${y}, counts: ${this.countBoardRetries}:`, availableMoves)
            if(availableMoves[MOVES.LEFT]) {
              this.updateCopyOfBoard(x, y, MOVES.LEFT, this.countBoardRetries)
              this.move(x, y, MOVES.LEFT)
              isMoved = true;
              lastMoveType = MOVES.LEFT;
              break;
            }
  
            if(availableMoves[MOVES.BOTTOM]) { 
              this.updateCopyOfBoard(x, y, MOVES.BOTTOM, this.countBoardRetries)
              this.move(x, y, MOVES.BOTTOM)
              isMoved = true;
              lastMoveType = MOVES.BOTTOM;
              break;
            }
  
            if(availableMoves[MOVES.UP]) {
                // console.log('here up...')
                // console.log('x:', x)
                // console.log('y:', y)
                // console.log('countBoardRetries:', this.countBoardRetries)
                if(y == 5 & x == 1  ) { // && !Object.keys(this.gameMoveStack).length
                    // console.log('y == 5 and x == 1')
                    // console.log('gameMoveStack length:', this.gameMoveStack.length)
                    // return;
                }
              this.updateCopyOfBoard(x, y, MOVES.UP, this.countBoardRetries)
              this.move(x, y, MOVES.UP)
              isMoved = true;
              lastMoveType = MOVES.UP;
              break;
            }
  
            if(availableMoves[MOVES.RIGHT]) {
              this.updateCopyOfBoard(x, y, MOVES.RIGHT, this.countBoardRetries)
              this.move(x, y, MOVES.RIGHT)
              isMoved = true;
              lastMoveType = MOVES.RIGHT;
              break;
            }

            if(isMoved) {
                break;  
            }
        }

        if(isMoved) {
          break;  
        }
      }
  
      const TotalEmptyFieldsOfCopyBoard = this.getTotalEmptyFields(this.copyOfBoard);
      
      // console.log('1:', `${TotalEmptyFieldsOfCopyBoard} === ${this.emptyPinsInPreviousMoved}`)
      // console.log('this.memoryMoves:', this.memoryMoves )
      // console.log('Object.values(availableMoves).filter(bool => bool):', Object.values(availableMoves).filter(bool => bool))
      // console.log('1:', `${TotalEmptyFieldsOfCopyBoard} === ${this.totalEmptyFieldsInDst}`)
    //   console.log('!this.isNewBoardEqualToDstBoard(this.copyOfBoard, this.dst)', !this.isNewBoardEqualToDstBoard(this.copyOfBoard, this.dst))
      // console.log(this.copyOfBoard)
      if(
          TotalEmptyFieldsOfCopyBoard === this.emptyPinsInPreviousMoved 
          || (!this.isNewBoardEqualToDstBoard(Array.from(this.copyOfBoard), Array.from(this.dst)) && TotalEmptyFieldsOfCopyBoard === this.totalEmptyFieldsInDst) 
          || !Object.values(availableMoves).filter(bool => bool).length
        ) {
          // console.log('into')
        // setTimeout(() => {
            // console.log('this.gameMoveStack:', this.gameMoveStack)
            // console.log('this.memoryMoves:', this.memoryMoves )
          const lastMove = this.gameMoveStack.pop();
          this.countBoardRetries = lastMove.retryBoardNumber
          this.emptyPinsInPreviousMoved = lastMove.emptyPinsInPreviousMoved;
          // this.pushMoveToMemory(x, y, lastMoveType, this.countBoardRetries); // , emptyPinsInPreviousMoved
          this.copyOfBoard = Array.from(lastMove.copyOfBoard);
          console.log('--------------------------------------------')
          this.loopOverBoard();
        // }, 5)
        return;
      }

      // console.log('2:', `${TotalEmptyFieldsOfCopyBoard} < ${this.totalEmptyFieldsInDst}`)
      if(TotalEmptyFieldsOfCopyBoard < this.totalEmptyFieldsInDst) { 
        // setTimeout(() => {
          console.log('--------------------------------------------')
          this.emptyPinsInPreviousMoved = TotalEmptyFieldsOfCopyBoard
          this.countBoardRetries++
          this.loopOverBoard();
        // }, 5)
          return;
      }

      console.log('3:', this.isNewBoardEqualToDstBoard(Array.from(this.copyOfBoard), Array.from(this.dst)))
      if(this.isNewBoardEqualToDstBoard(Array.from(this.copyOfBoard), Array.from(this.dst))) {
        console.log('here')
        // console.log(this.moves[this.countGameRetries])
        console.log(this.gameMoveStack)
      } else {
        console.log('Failed...')
        // console.log(this.moves[this.countGameRetries])
        console.log(this.gameMoveStack)
      }
    }
  
    // resetGame() {
    //   this.copyOfBoard = Array.from(this.src);
    //   this.countGameRetries++
    //   this.countBoardRetries = 0;
    // }
  
    isNewBoardEqualToDstBoard(newBoard, dstBoard) {      
      let isEqual = true;
      for(let y = 0; y < dstBoard.length; y++) {
        const copyOfBoard = newBoard[y];
        const dstRow = dstBoard[y];
        if(copyOfBoard != dstRow) {
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
          !this.isTherePin(x - PIN_MOVE_COUNT, y) &&
          !this.isMoveInExistsMemory(x, y, MOVES.LEFT, this.countBoardRetries)
        //   && (this.dst[y][x] == EMPTY_CAHR && this.dst[y][x - 1] == EMPTY_CAHR)
        ) {
        availableMoves[MOVES.LEFT] = true;
      }
  
      if(
        this.isValidBounds(x, y, MOVES.BOTTOM) &&
        !this.isMoveInExistsMemory(x, y, MOVES.BOTTOM, this.countBoardRetries)
        //   && (this.dst[y][x] == EMPTY_CAHR && this.dst[y + 1][x] == EMPTY_CAHR)
        ) {
          if([0, 1].includes(y) && !this.isTherePin(x + 2, y + PIN_MOVE_COUNT)) {
            availableMoves[MOVES.BOTTOM] = true;
          } 
          else if([3, 4].includes(y) && !this.isTherePin(x - 2, y + PIN_MOVE_COUNT)) {
            availableMoves[MOVES.BOTTOM] = true;
          } 
          else if(y == 2 && !this.isTherePin(x, y + PIN_MOVE_COUNT)){
            availableMoves[MOVES.UP] = true;
          }
      }
      
      if(
        this.isValidBounds(x, y, MOVES.UP) &&
        !this.isMoveInExistsMemory(x, y, MOVES.UP, this.countBoardRetries)
        //   && (this.dst[y][x] == EMPTY_CAHR && this.dst[y - 1][x] == EMPTY_CAHR)
        ) {
          if(x == 3 && y == 3) {
            console.log('move')
            console.log(Array.from(this.copyOfBoard))
          }
          if([2, 3].includes(y) && !this.isTherePin(x - 2, y - PIN_MOVE_COUNT)) {
            console.log('here',!this.isTherePin(x - 2, y - PIN_MOVE_COUNT))
            availableMoves[MOVES.UP] = true;
          }
          else if([5, 6].includes(y) && !this.isTherePin(x + 2, y - PIN_MOVE_COUNT)) {
            availableMoves[MOVES.UP] = true;
          } 
          else if(y == 4 && !this.isTherePin(x, y - PIN_MOVE_COUNT)) {
            availableMoves[MOVES.UP] = true;
          }
      }
      
      if(
        this.isValidBounds(x, y, MOVES.RIGHT) && 
          !this.isTherePin(x + PIN_MOVE_COUNT, y) &&
          !this.isMoveInExistsMemory(x, y, MOVES.RIGHT, this.countBoardRetries)
        //   && (this.dst[y][x] == EMPTY_CAHR && this.dst[y][x + 1] == EMPTY_CAHR)
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
          if([0, 1].includes(y) && this.copyOfBoard[y + PIN_MOVE_COUNT] && this.copyOfBoard[y + PIN_MOVE_COUNT][x + 2]) {
            result = true
          } 
          else if([3, 4].includes(y) && this.copyOfBoard[y + PIN_MOVE_COUNT] && this.copyOfBoard[y + PIN_MOVE_COUNT][x - 2]) {
            result = true
          } 
          else if(y == 2 && this.copyOfBoard[y + PIN_MOVE_COUNT] && this.copyOfBoard[y + PIN_MOVE_COUNT][x]){
            result = true
          }
        break;
  
        case MOVES.UP:
          if([2, 3].includes(y) && this.copyOfBoard[y - PIN_MOVE_COUNT] && this.copyOfBoard[y - PIN_MOVE_COUNT][x - 2]) {
            result = true
          }
          else if([5, 6].includes(y) && this.copyOfBoard[y - PIN_MOVE_COUNT] && this.copyOfBoard[y - PIN_MOVE_COUNT][x + 2]) {
            result = true
          } 
          else if(y == 4 && this.copyOfBoard[y - PIN_MOVE_COUNT] && this.copyOfBoard[y - PIN_MOVE_COUNT][x]) {
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
      return this.copyOfBoard[y][x] == PIN_CAHR;
    }
  
    move(x, y, moveType) {
      const move = {x, y, moveType};
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
         ' OOO ', 
        'OOOOOOO', 
        'OOOOOOO', 
        'OOOO..O', 
         ' O.O ', 
         ' OOO ']
         // UP, LEFT  
      // [' OOO ', ' OOO ', 'OOOOOOO', 'OOO.OOO', 'OOOOOOO', ' OOO ', ' OOO '] 
    )
  } catch(e) {
    console.log(game.moves[this.countGameRetries], e)
  }
  
  // [              
  //   ' OOO ',        ' OOO ',
  //   ' OOO ',        ' OOO ', 
  //  'OOOOOOO',      'O.O.OOO', 
  //  'OOO.OOO',      'OOO..OO', 
  //  'OOOOOOO',      '..O.OOO', 
  //   ' OOO ',        ' O.O ', 
  //   ' OOO '         ' OOO '
  // ]
  
  //   ' OOO ',
  //   ' OOO ',   
  //  'OOOOOO',  
  //  'OOO..OO',  
  //  'OOOOOOO',  
  //   ' OOO ',  
  //   ' OOO ' 
  
  