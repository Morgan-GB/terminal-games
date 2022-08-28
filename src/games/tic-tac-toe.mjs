import readline from "readline"
import chalk from "chalk"

// Initiate readline
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

export async function game() {
  const board = new Board();
  await board.startGame();
}

class Board {
  currentPlayer = [1, "x"]
  s = {}

  constructor() {
    for (let i = 1; i <= 9; i++) {
      this.s[i] = i.toString()
    }
  }

  async startGame() {
    this.printBoard()
    await this.continue();
  }

  async continue() {
    await this.nextMove();
  }

  printBoard() {
    const boardEntry = (number) => {
      const value = this.s[number];
      if (/[0-9]/g.test(value)) return chalk.bold.green(`${this.s[`${number}`]}`)
      else if (value === "x") return chalk.bold.yellow(`x`)
      else if (value === "o") return chalk.bold.yellow(`o`)
    }

    console.log(`-------------`)
    console.log(`| ${boardEntry(1)} | ${boardEntry(2)} | ${boardEntry(3)} |`)
    console.log(`+---+---+---+`)
    console.log(`| ${boardEntry(4)} | ${boardEntry(5)} | ${boardEntry(6)} |`)
    console.log(`+---+---+---+`)
    console.log(`| ${boardEntry(7)} | ${boardEntry(8)} | ${boardEntry(9)} |`)
    console.log(`-------------`)
  }

  validateEntries() {
    return [true, "e"]
    // Check if any player has won the round, if there's a tie or the game should continue

    /*
    if (square 1 = square 2 = square 3, etc, etc) {
      return [false, "win"]
    }
    if (all squares are either `x` or `o` (tie)) {
      return [false, "tie"]
    }
    else {
      return [true, "continue"]
    }
    */
  }

  markSquare(square, player) {
    this.s[square] = player
  }
  
  checkIfSquareFree(square) {
    if (this.s[square] === square) {
      return true
    }
    return false
  }

  async nextMove() {
    const squareToMark = await getUserInput(`Player ${this.currentPlayer[0]}, which square do you want to mark?`);

    if (!(squareToMark >= 1) || !(squareToMark <= 9) || !/[0-9]/g.test(squareToMark)) {
      console.log("Please enter a valid number!");
      await this.continue();
    }

    const isFree = this.checkIfSquareFree(squareToMark);

    if (!isFree) {
      console.log("That square is not free...");
      await this.continue()
      return;
    }

    this.markSquare(squareToMark, this.currentPlayer[1])

    const validToContinue = this.validateEntries();

    if(!validToContinue[0]) {
      console.log(validToContinue[1]);
      return;
    }

    this.currentPlayer = [2, "o"];
    this.printBoard();
    await this.continue();
  }
}

async function getUserInput(question) {
  const answer = await new Promise((resolve) => rl.question(`${question}: `, resolve))
  return answer
}
