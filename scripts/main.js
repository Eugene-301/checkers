const desk = document.querySelector(".desk");

const fieldSize = {
  x: 8,
  y: 8,
};

let ghosts = [];
let takes = [];
let cells = [];
let pieces = {
  blackPieces: [],
  whitePieces: [],
};
let isWhitePlayer = true;
let lastSelected = null;

const isExists = (coords) => {
  if (cells[coords[0]] && cells[coords[0]][coords[1]]) {
    return cells[coords[0]][coords[1]];
  }

  return false;
};

const isNotEmpty = (node) => {
  return node.hasChildNodes();
};

const move = (cell, target) => {
  target.node.append(cell.piece.node);
  target.piece = cell.piece;

  cell.piece = null;
  isWhitePlayer = !isWhitePlayer;
};

const createGhost = (cell) => {
  const ghost = document.createElement("div");
  ghost.classList = "piece ghost";
  cell.node.append(ghost);
  cell.canMove = true;
  ghosts.push(ghost);
};

const moves = (cell) => {
  const cellLeftUp = isExists([cell.x - 1, cell.y - 1]);
  const cellRightUp = isExists([cell.x - 1, cell.y + 1]);
  const cellLeftDown = isExists([cell.x + 1, cell.y - 1]);
  const cellRightDown = isExists([cell.x + 1, cell.y + 1]);

  ghosts.forEach((ghost) => {
    ghost.remove();
  });

  if (cell.piece.isWhite) {
    if (cellLeftUp) {
      if (!isNotEmpty(cellLeftUp.node)) {
        createGhost(cellLeftUp);
      }
    }

    if (cellRightUp) {
      if (!isNotEmpty(cellRightUp.node)) {
        createGhost(cellRightUp);
      }
    }
  } else {
    if (cellLeftDown) {
      if (!isNotEmpty(cellLeftDown.node)) {
        createGhost(cellLeftDown);
      }
    }

    if (cellRightDown) {
      if (!isNotEmpty(cellRightDown.node)) {
        createGhost(cellRightDown);
      }
    }
  }
};

const cellClick = (event) => {
  const cell = event.currentTarget.cell;

  if (
    isNotEmpty(cell.node) &&
    cell.node.firstChild.classList.contains("ghost")
  ) {
    move(lastSelected, cell);
  }

  if (takes.length > 0) return;

  if (lastSelected) {
    lastSelected.isSelected = false;
    lastSelected.node.classList.remove("cell-selected");
  }

  ghosts.forEach((ghost) => {
    ghost.remove();
  });

  if (!isNotEmpty(cell.node)) return;

  if (cell.piece.isWhite !== isWhitePlayer) return;

  lastSelected = cell;
  cell.isSelected = true;
  cell.node.classList.add("cell-selected");
  moves(cell);

  console.log(cell);
};

const createPiece = (cell, isWhite) => {
  const piece = document.createElement("div");

  piece.classList.add("piece");
  piece.classList.add(isWhite ? "white" : "black");

  cell.append(piece);

  if (isWhite) {
    pieces.whitePieces.push({
      node: piece,
      isQueen: false,
      cell: cell,
      isWhite: isWhite,
    });

    return pieces.whitePieces[pieces.whitePieces.length - 1];
  } else {
    pieces.blackPieces.push({
      node: piece,
      isQueen: false,
      cell: cell,
      isWhite: isWhite,
    });

    return pieces.blackPieces[pieces.blackPieces.length - 1];
  }
};

const createCell = (isWhite, x, y) => {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.classList.add(isWhite ? "white" : "black");
  cell.id = `${x}${y}`;

  let piece = null;

  if (x < 3 && !isWhite) {
    piece = createPiece(cell, false);
  } else if (x > 4 && !isWhite) {
    piece = createPiece(cell, true);
  }

  cells[x][y] = {
    node: cell,
    x: x,
    y: y,
    piece: piece,
    isSelected: false,
    canMove: false,
  };

  cell.addEventListener("click", cellClick, false);
  cell.cell = cells[x][y];

  desk.append(cell);

  return cell;
};

const createField = () => {
  let isWhite = true;

  for (let x = 0; x < fieldSize.x; x++) {
    cells.push([]);
    for (let y = 0; y < fieldSize.y; y++) {
      createCell(isWhite, x, y);

      isWhite = !isWhite;
    }

    isWhite = !isWhite;
  }
};

createField();

console.log(cells);
