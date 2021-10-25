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
    totalEmptyFieldsInDst;
    countBoardRetries = 0;
    memoryMoves = [];
    emptyPinsInPreviousMoved = 1;
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
            if(availableMoves[MOVES.LEFT]) {
              this.updateCopyOfBoard(x, y, MOVES.LEFT, this.countBoardRetries)
              isMoved = true;
              lastMoveType = MOVES.LEFT;
              break;
            }
  
            if(availableMoves[MOVES.BOTTOM]) { 
              this.updateCopyOfBoard(x, y, MOVES.BOTTOM, this.countBoardRetries)
              isMoved = true;
              lastMoveType = MOVES.BOTTOM;
              break;
            }
  
            if(availableMoves[MOVES.UP]) {
              this.updateCopyOfBoard(x, y, MOVES.UP, this.countBoardRetries)
              isMoved = true;
              lastMoveType = MOVES.UP;
              break;
            }
  
            if(availableMoves[MOVES.RIGHT]) {
              this.updateCopyOfBoard(x, y, MOVES.RIGHT, this.countBoardRetries)
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

      if(
          TotalEmptyFieldsOfCopyBoard === this.emptyPinsInPreviousMoved 
          || (!this.isNewBoardEqualToDstBoard(Array.from(this.copyOfBoard), Array.from(this.dst)) && TotalEmptyFieldsOfCopyBoard === this.totalEmptyFieldsInDst) 
          || !Object.values(availableMoves).filter(bool => bool).length
        ) {
          const lastMove = this.gameMoveStack.pop();
          if(!lastMove) {
            console.error('There no more moves...')
            return
          }
          this.countBoardRetries = lastMove.retryBoardNumber
          this.emptyPinsInPreviousMoved = lastMove.emptyPinsInPreviousMoved;
          this.copyOfBoard = Array.from(lastMove.copyOfBoard);
          this.loopOverBoard();
        return;
      }

      if(TotalEmptyFieldsOfCopyBoard < this.totalEmptyFieldsInDst) { 
          this.emptyPinsInPreviousMoved = TotalEmptyFieldsOfCopyBoard
          this.countBoardRetries++
          this.loopOverBoard();
          return;
      }

      if(this.isNewBoardEqualToDstBoard(Array.from(this.copyOfBoard), Array.from(this.dst))) {
        console.log('result: ', this.gameMoveStack)
      } else {
        console.log('Failed...', this.gameMoveStack)
      }
    }
  
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
  
    getPinMoves(x, y) {
      let availableMoves = {
        [MOVES.LEFT]: false,
        [MOVES.UP]: false,
        [MOVES.BOTTOM]: false,
        [MOVES.RIGHT]: false,
      }
      
      if(
          this.isValidBounds(x, y, MOVES.LEFT) &&
          !this.isTherePin(x - PIN_MOVE_COUNT, y) &&
          this.isTherePin(x - 1, y) &&
          !this.isMoveInExistsMemory(x, y, MOVES.LEFT, this.countBoardRetries)
        ) {
        availableMoves[MOVES.LEFT] = true;
      }
  
      if(
        this.isValidBounds(x, y, MOVES.BOTTOM) &&
        !this.isMoveInExistsMemory(x, y, MOVES.BOTTOM, this.countBoardRetries)
        ) {
          if([0, 1].includes(y) && !this.isTherePin(x + 2, y + PIN_MOVE_COUNT)) {
            if(y == 1 && this.isTherePin(x + 2, y + 1)) {
              availableMoves[MOVES.BOTTOM] = true;            
            }
            else if(y == 0 && this.isTherePin(x, y + 1)) {
              availableMoves[MOVES.BOTTOM] = true;            
            }
          } 
          else if([3, 4].includes(y) && !this.isTherePin(x - 2, y + PIN_MOVE_COUNT) ) {
            if(y == 4 && this.isTherePin(x - 2, y + 1)) {
              availableMoves[MOVES.BOTTOM] = true;
            }
            else if(y == 3 && this.isTherePin(x, y + 1)) {
              availableMoves[MOVES.BOTTOM] = true;
            }
          } 
          else if(y == 2 && !this.isTherePin(x, y + PIN_MOVE_COUNT) && this.isTherePin(x, y + 1)){
            availableMoves[MOVES.BOTTOM] = true;
          }
      }
      
      if(
        this.isValidBounds(x, y, MOVES.UP) &&
        !this.isMoveInExistsMemory(x, y, MOVES.UP, this.countBoardRetries)
        ) {
          if([2, 3].includes(y) && !this.isTherePin(x - 2, y - PIN_MOVE_COUNT)) {
            if(y == 2 && this.isTherePin(x - 2, y - 1)) {
              availableMoves[MOVES.UP] = true;
            } else if(y == 3 && this.isTherePin(x, y - 1)) {
              availableMoves[MOVES.UP] = true;
            }
          }
          else if([5, 6].includes(y) && !this.isTherePin(x + 2, y - PIN_MOVE_COUNT) ) {
            if(y == 5 && this.isTherePin(x + 2, y - 1)) {
              availableMoves[MOVES.UP] = true;
            }
            else if(y == 6 && this.isTherePin(x, y - 1)) {
              availableMoves[MOVES.UP] = true;
            }
          } 
          else if(y == 4 && !this.isTherePin(x, y - PIN_MOVE_COUNT) && this.isTherePin(x, y - 1)) {
            availableMoves[MOVES.UP] = true;
          }
      }
      
      if(
        this.isValidBounds(x, y, MOVES.RIGHT) && 
          !this.isTherePin(x + PIN_MOVE_COUNT, y) &&
          this.isTherePin(x + 1, y) &&
          !this.isMoveInExistsMemory(x, y, MOVES.RIGHT, this.countBoardRetries)
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
  }
  
  String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }
  
  const game = new Game();
  try {
    game.init(
      [' OOO ',' OOO ', 'OOOOOOO', 'OOO.OOO', 'O..OOOO', ' O.O ', ' O.O ']
    )
  } catch(e) {
    console.log(game.gameMoveStack, e)
  }