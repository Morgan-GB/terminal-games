#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { readdirSync } from "fs"
import { join } from "path"

const y = yargs(hideBin(process.argv))
  .alias("l", "list")
  .describe("list", "List all available games")
  // .strict

const argv = y.argv

// Scan games directory  
const currentDir = join(import.meta.url, "../").replace(/^file:/, "");
const gamesDir = join(currentDir, "games")
const games = readdirSync(gamesDir).map((x) => x.split(".")[0]);

// If the user wants to list all available games
if (argv.list) list();
else playGame();

function prettify(name) {
  let pretty = name.split("-")
  pretty = pretty.map((x) => x[0].toUpperCase() + x.substring(1))
  pretty = pretty.join(" ")
  return pretty
}

function list() {
  console.log(`This project currently has ${games.length} games!`)

  for (const game of games) {
    const pretty = prettify(game);
    console.log(`${pretty} (${game})`)
  }
}

async function playGame() {
  let success = false;

  for (const game of games) {
    if (argv._.includes(game)) {
      success = true;
      const importedGame = await import(join(gamesDir, `${game}.js`));
      await importedGame.game();
      console.log("Thank you for playing!")
      process.exit(0);
    }
  }
  
  if (success) return;

  console.log("No valid game was selected!");
  list();
  process.exit(1)
}
