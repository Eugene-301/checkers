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
  whiteQueens: [],
  blackQueens: [],
};
let isWhitePlayer = true;
let lastSelected = null;
let selectBlocked = false;

const select = (cell) => {
  if (cell.isSelected) return;
  lastSelected = cell;
  lastSelected.isSelected = true;
  lastSelected.node.classList.add("cell-selected");
};

const unSelect = () => {
  if (!lastSelected) return;
  lastSelected.isSelected = false;
  lastSelected.node.classList.remove("cell-selected");
  lastSelected = null;
};

const clearGhosts = () => {
  ghosts.forEach((ghost) => {
    ghost[1].remove();
    ghost[0].canMove = false;
  });

  ghosts = [];
};

const createGhost = (cell, isLocal = false) => {
  const ghost = document.createElement("div");
  ghost.classList = "piece ghost";
  cell.node.append(ghost);

  cell.canMove = true;

  if (isLocal) {
    return [cell, ghost];
  }
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

const checkQueens = () => {
  for (let i = 0; i < fieldSize.x; i++) {
    let borderPiece = cells[isWhitePlayer ? 0 : 7][i].piece;

    if (
      borderPiece &&
      (isWhitePlayer ? borderPiece.isWhite : !borderPiece.isWhite) &&
      !borderPiece.isQueen
    ) {
      borderPiece.isQueen = true;
      borderPiece.node.classList.add("queen");
    }
  }
};

const checkTake = (cell) => {
  const nearCells = getNearestCells(cell);

  Object.keys(nearCells).forEach((cell) => {
    let middle = nearCells[cell];
    let target = getNearestCells(middle)[cell];

    if (
      middle &&
      middle.piece &&
      (isWhitePlayer ? !middle.piece.isWhite : middle.piece.isWhite) &&
      target &&
      !isNotEmpty(target)
    ) {
      unSelect();
      clearGhosts();

      select(nearCells[cell]);
      createGhost(target);
      const take = {
        cell: cell,
        defeatCell: middle,
        endPoint: target,
      };

      takes.push(take);
    }
  });
};

const checkTakes = () => {
  pieces[isWhitePlayer ? "whitePieces" : "blackPieces"].forEach((piece) => {
    const nearCells = getNearestCells(piece.cell);

    let currentCell = piece.cell;

    // for (let i = 0; i < fieldSize.x; i++) {
    //   currentCell = nearCells.leftUp;
    //   let localGhosts = [];

    //   if (!currentCell) {
    //     ghosts.push(...localGhosts);
    //     break;
    //   }

    //   if (!isNotEmpty(currentCell)) {
    //     localGhosts.append(createGhost(currentCell));
    //   } else if (currentCell.piece.isWhite === piece.isWhite) {
    //     break;
    //   } else if (currentCell.piece.isWhite !== piece.isWhite) {
    //     const leftUpCell = getNearestCells(currentCell).leftUp;
    //     if (leftUpCell && !isNotEmpty(leftUpCell)) {
    //       takes.push({
    //         cell: piece.cell,
    //         defeatCell: currentCell,
    //         endPoint: leftUpCell,
    //       });
    //       break;
    //     }
    //   }
    // }

    Object.keys(nearCells).forEach((cell) => {
      let middle = nearCells[cell];
      let target = getNearestCells(middle)[cell];

      if (
        middle &&
        middle.piece &&
        (isWhitePlayer ? !middle.piece.isWhite : middle.piece.isWhite) &&
        target &&
        !isNotEmpty(target)
      ) {
        unSelect();
        clearGhosts();

        select(currentCell);
        createGhost(target);

        const take = {
          cell: currentCell,
          defeatCell: middle,
          endPoint: target,
        };

        takes.push(take);
      }
    });
  });
};

const move = (cell, target) => {
  if (takes.length > 0) {
    target.node.append(cell.piece.node);
    target.piece = cell.piece;
    cell.piece.cell = target;

    cell.piece = null;

    takes.forEach((elem) => {
      if (elem.cell === cell && elem.endPoint === target) {
        elem.defeatCell.piece.node.remove();

        let piecesColor =
          pieces[!isWhitePlayer ? "whitePieces" : "blackPieces"];
        let pieceIndex = piecesColor.indexOf(elem.defeatCell.piece);

        piecesColor.splice(pieceIndex, 1);

        elem.defeatCell.piece = null;
        checkQueens();

        takes = [];
        checkTake(elem.endPoint);
        if (takes.length === 0) isWhitePlayer = !isWhitePlayer;
      }
    });
  } else {
    target.node.append(cell.piece.node);
    target.piece = cell.piece;
    cell.piece.cell = target;

    cell.piece = null;

    checkQueens();
    isWhitePlayer = !isWhitePlayer;
  }
};

const calcMoves = (cell) => {
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

  if (cell.isSelected) return;

  if (cell.canMove) {
    move(lastSelected, cell);

    unSelect();
    clearGhosts();
    takes = [];
    checkTakes();

    return;
  }
  if ((!isNotEmpty(cell) && !cell.canMove) || lastSelected) {
    unSelect();
    clearGhosts();
  }

  if (isNotEmpty(cell) && cell.piece.isWhite === isWhitePlayer) {
    if (takes.length > 0) {
      takes.forEach((elem) => {
        if (cell === elem.cell) {
          select(cell);
          createGhost(elem.endPoint);
        }
      });
    } else {
      if (ghosts.length > 0) {
        select(cell);
        clearGhosts();
        calcMoves(cell);
      }

      select(cell);
      calcMoves(cell);
    }
  }
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

    cell.piece = piece;
  } else {
    pieces.blackPieces.push(piece);

    cell.piece = piece;
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
