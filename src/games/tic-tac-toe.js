import readline from "readline"
import chalk from "chalk"
import ansiEscapes from "ansi-escapes"

// Initiate readline
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

export async function game() {
  const board = new Board();
  await board.startGame();
}

class Board {
  turns = 0;
  currentPlayer = [1, "x"]
  s = {}

  constructor() {
    for (let i = 1; i <= 9; i++) {
      this.s[i] = i.toString()
    }
  }

  async startGame() {
    this.printBoard()
    await this.nextMove();
  }

  printBoard() {
    if (this.turns > 0) process.stdout.write(ansiEscapes.cursorUp(8))
    
    const boardEntry = (number) => {
      const value = this.s[number];
      if (/[0-9]/g.test(value)) return chalk.bold.green(`${this.s[`${number}`]}`)
      else if (value === "x") return chalk.bold.yellow(`x`)
      else if (value === "o") return chalk.bold.yellow(`o`)
    }

    console.log(`-------------`)
    console.log(`| ${boardEntry(7)} | ${boardEntry(8)} | ${boardEntry(9)} |`)
    console.log(`+---+---+---+`)
    console.log(`| ${boardEntry(4)} | ${boardEntry(5)} | ${boardEntry(6)} |`)
    console.log(`+---+---+---+`)
    console.log(`| ${boardEntry(1)} | ${boardEntry(2)} | ${boardEntry(3)} |`)
    console.log(`-------------`)
  }

  validateEntries() {
    // Check if any player has won the round, if there's a tie or the game should continue
    if (
      this.checkEquality(1, 2, 3) ||
      this.checkEquality(4, 5, 6) ||
      this.checkEquality(7, 8, 9) ||
      this.checkEquality(1, 4, 7) ||
      this.checkEquality(2, 5, 8) ||
      this.checkEquality(3, 6, 9) ||
      this.checkEquality(1, 5, 9) ||
      this.checkEquality(3, 5, 7)
    ) {
      return [false, `Player ${this.currentPlayer[0]} wins!`]
    } 
    else if (/^[a-zA-Z]*$/g.test(Object.values(this.s).join(""))) {
      return [false, `Player 1 and 2 have tied!`]
    }
    else {
      return [true]
    }
  }

  checkEquality(x, y, z) {
    return this.s[x] === this.s[y] && this.s[x] === this.s[z]
  }

  markSquare(square, player) {
    this.s[square] = player
    this.turns++;
  }
  
  checkIfSquareFree(square) {
    if (this.s[square] === square) {
      return true
    }
    return false
  }

  async nextMove(message) {
    if (message)
      process.stdout.write(ansiEscapes.cursorUp())
    const squareToMark = await getUserInput(`${message ? `${message} ` : ""}Player ${this.currentPlayer[0]}, which square do you want to mark?`);

    if (!(squareToMark >= 1) || !(squareToMark <= 9) || !/[0-9]/g.test(squareToMark)) {
      await this.nextMove("Please enter a valid number!");
    }

    const isFree = this.checkIfSquareFree(squareToMark);

    if (!isFree) {
      await this.nextMove("That square is not free...")
      return;
    }

    this.markSquare(squareToMark, this.currentPlayer[1])

    const validToContinue = this.validateEntries();

    if(!validToContinue[0]) {
      this.printBoard();
      console.log(ansiEscapes.eraseEndLine + validToContinue[1]);
      console.log(`Game ended in ${this.turns} turns!`)
      return;
    }

    if (this.currentPlayer[0] === 1) this.currentPlayer = [2, "o"];
    else this.currentPlayer = [1, "x"];
    this.printBoard();
    await this.nextMove();
  }
}

async function getUserInput(question) {
  const answer = await new Promise((resolve) => rl.question(`${question}: `, resolve))
  return answer
}

