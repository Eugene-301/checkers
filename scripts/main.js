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
let selectBlocked = false;

const switchSelect = (cell) => {
  if (selectBlocked) return;

  if (lastSelected) {
    lastSelected.isSelected = false;
    lastSelected.node.classList.remove("cell-selected");

    ghosts.forEach((ghost) => {
      ghost[1].remove();
    });
  }

  if (!cell.piece || cell.piece.isWhite !== isWhitePlayer) return;

  lastSelected = cell;
  lastSelected.isSelected = true;
  lastSelected.node.classList.add("cell-selected");

  moves(cell);
};

const createGhost = (cell) => {
  const ghost = document.createElement("div");
  ghost.classList = "piece ghost";
  cell.node.append(ghost);

  cell.canMove = true;
  ghosts.push([cell, ghost]);
};

const getNearestCells = (cell) => {
  return {
    leftUp: isExists([cell.x - 1, cell.y - 1]),
    rightUp: isExists([cell.x - 1, cell.y + 1]),
    leftDown: isExists([cell.x + 1, cell.y - 1]),
    rightDown: isExists([cell.x + 1, cell.y + 1]),
  };
};

const isExists = (coords) => {
  if (cells[coords[0]] && cells[coords[0]][coords[1]]) {
    return cells[coords[0]][coords[1]];
  }

  return false;
};

const isNotEmpty = (cell) => {
  return cell.node.hasChildNodes();
};

const checkTakes = () => {
  if (isWhitePlayer) {
    pieces.whitePieces.forEach((piece) => {});
  } else if (!isWhitePlayer) {
    pieces.blackPieces.forEach((piece) => {
      const nearCells = getNearestCells(piece.cell);

      let currentCell = piece.cell;
      let middle = nearCells.leftDown;
      let target = getNearestCells(nearCells.leftDown).leftDown;

      if (
        middle &&
        isNotEmpty(middle.node) &&
        middle.piece.isWhite &&
        target &&
        !isNotEmpty(target.node)
      ) {
        createGhost(target);
        lastSelected.isSelected = false;
        lastSelected.node.classList.remove("cell-selected");

        lastSelected = currentCell;
        lastSelected.node.classList.add("cell-selected");
        lastSelected.isSelected = true;
      }
    });
  }
};

const move = (cell, target) => {
  target.node.append(cell.piece.node);
  target.piece = cell.piece;

  cell.piece = null;
  isWhitePlayer = !isWhitePlayer;

  ghosts.forEach((ghost) => {
    ghost[1].remove();
    ghost[0].canMove = false;
  });

  ghosts = [];
  // checkTakes();
};

const moves = (cell) => {
  const nearCells = getNearestCells(cell);

  if (cell.piece.isWhite) {
    if (nearCells.leftUp) {
      if (!isNotEmpty(nearCells.leftUp)) {
        createGhost(nearCells.leftUp);
      }
    }

    if (nearCells.rightUp) {
      if (!isNotEmpty(nearCells.rightUp)) {
        createGhost(nearCells.rightUp);
      }
    }
  } else {
    if (nearCells.leftDown) {
      if (!isNotEmpty(nearCells.leftDown)) {
        createGhost(nearCells.leftDown);
      }
    }

    if (nearCells.rightDown) {
      if (!isNotEmpty(nearCells.rightDown)) {
        createGhost(nearCells.rightDown);
      }
    }
  }
};

const cellClick = (event) => {
  const cell = event.currentTarget.cell;

  switchSelect(cell);

  if (cell.canMove) {
    move(lastSelected, cell);
  }

  // const cell = event.currentTarget.cell;
  // if (
  //   isNotEmpty(cell.node) &&
  //   cell.node.firstChild.classList.contains("ghost")
  // ) {
  //   ghosts.forEach((ghost) => {
  //     ghost.remove();
  //   });
  //   move(lastSelected, cell);
  // }
  // if (takes.length > 0) return;
  // moves(cell);
};

const createPiece = (cell, isWhite) => {
  const pieceNode = document.createElement("div");

  pieceNode.classList.add("piece");
  pieceNode.classList.add(isWhite ? "white" : "black");

  cell.node.append(pieceNode);

  const piece = {
    node: pieceNode,
    isQueen: false,
    cell: cell,
    isWhite: isWhite,
  };

  if (isWhite) {
    pieces.whitePieces.push(piece);

    cell.piece = pieces.whitePieces[pieces.whitePieces.length - 1];
  } else {
    pieces.blackPieces.push(piece);

    cell.piece = pieces.blackPieces[pieces.blackPieces.length - 1];
  }
};

const createCell = (isWhite, x, y) => {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.classList.add(isWhite ? "white" : "black");
  cell.id = `${x}${y}`;

  cells[x][y] = {
    node: cell,
    x: x,
    y: y,
    piece: null,
    isSelected: false,
    canMove: false,
  };

  if (x < 3 && !isWhite) {
    createPiece(cells[x][y], false);
  } else if (x > 4 && !isWhite) {
    createPiece(cells[x][y], true);
  }

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
