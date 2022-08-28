export async function game() {
  const board = new Board();
  board.printBoard()
}

class Board {
  s = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
  }

  constructor() {}

  printBoard() {
    console.log(`-------------`)
    console.log(`| ${this.s["1"]} | ${this.s["2"]} | ${this.s["3"]} |`)
    console.log(`+---+---+---+`)
    console.log(`| ${this.s["4"]} | ${this.s["5"]} | ${this.s["6"]} |`)
    console.log(`+---+---+---+`)
    console.log(`| ${this.s["7"]} | ${this.s["8"]} | ${this.s["9"]} |`)
    console.log(`-------------`)
  }
}