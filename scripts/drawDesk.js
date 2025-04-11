const desk = document.querySelector(".desk");

let cells = [];
let isWhite = true;
let lastCell = null;

class Desk {
  constructor(player = "white", cells = [8, 8]) {
    this.player = player;
    this.cells = cells;

    this.initDesk();
  }

  initDesk() {
    for (let y = 0; y < this.cells[0]; y++) {
      let line = new Array();

      for (let x = 0; x < this.cells[1]; x++) {
        const cellNode = document.createElement("div");
        let cell;

        cellNode.classList = `cell ${isWhite ? "white" : "black"}`;

        cellNode.id = `${y}${x}`;

        if (y < 3 && !isWhite) {
          cellNode.classList.add("cell__piece-black");
          cell = new Cell([y, x], cellNode, "black");
        } else if (y > 4 && !isWhite) {
          cellNode.classList.add("cell__piece-white");
          cell = new Cell([y, x], cellNode, "white");
        } else {
          cell = new Cell([y, x], cellNode);
        }

        desk.append(cellNode);

        line.push(cell);
        isWhite = !isWhite;
      }

      isWhite = !isWhite;
      cells.push(line);
    }
  }
}

class Cell {
  constructor(coords, node, piece = null, isQueen = false) {
    this.coords = coords;
    this.node = node;
    this.piece = piece;
    this.isQueen = isQueen;

    this.node.addEventListener("click", this.clickCell);
  }

  clickCell() {
    const coords = this.id;
    const cell = cells[coords[0]][coords[1]];

    if (!cell.piece || newDesk.player !== cell.piece) return;
    if (lastCell) lastCell.classList.remove("cell-selected");

    const cellNode = cell.node;

    cellNode.classList.add("cell-selected");
    lastCell = cellNode;
  }
}

const newDesk = new Desk();
