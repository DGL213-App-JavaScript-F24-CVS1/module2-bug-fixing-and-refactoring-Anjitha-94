"use strict";

(() => {
window.addEventListener("load", (event) => {
    console.log(event);
// *****************************************************************************
// #region Constants and Variables

// Canvas references
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// UI references
const restartButton = document.querySelector("#restart");
const undoButton = document.querySelector('#undo');

// Constants
const CELLS_PER_AXIS = 3;
const CELL_WIDTH = canvas.width/CELLS_PER_AXIS;
const CELL_HEIGHT = canvas.height/CELLS_PER_AXIS;


// Game objects
let grids;
let currentPlayer = "X";
let gameOver = false;

// #endregion


// *****************************************************************************
// #region Game Logic


function startGame() {
    grids = initializeGrid();
    render(grids);
    gameOver = false;
    currentPlayer = "X";  // X always starts first
}

function initializeGrid() {
    const newGrid = [];
    for (let i = 0; i < CELLS_PER_AXIS * CELLS_PER_AXIS; i++) {
        newGrid.push("");
    }
    return newGrid;
}


function render(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before each render
    for (let i = 0; i < grid.length; i++) {
        const col = i % CELLS_PER_AXIS;
        const row = Math.floor(i / CELLS_PER_AXIS);
        const xPos = col * CELL_WIDTH;
        const yPos = row * CELL_HEIGHT;

        ctx.strokeStyle = "black";
        ctx.strokeRect(xPos, yPos, CELL_WIDTH, CELL_HEIGHT);

        // Draw X or O
        if (grid[i]) {
            ctx.font = "48px Arial";
            ctx.fillText(grid[i], xPos + CELL_WIDTH / 3, yPos + CELL_HEIGHT / 1.5);
        }
    }
}

function updateGridAt(mouseX, mouseY) {
    if (gameOver) return; // Prevent moves after the game is over

    const gridCoordinates = convertCartesiansToGrid(mouseX, mouseY);
    const index = gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column;

    if (grids[index] === "") { // Only mark if the cell is empty
        grids[index] = currentPlayer;
        render(grids);

        if (checkWinCondition()) {
            alert(`${currentPlayer} wins!`);
            gameOver = true;
        } else if (grids.every(cell => cell !== "")) {
            alert("It's a tie!");
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
        }
    }
}
function checkWinCondition() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    return winPatterns.some(pattern => {
        return grids[pattern[0]] !== "" &&
            grids[pattern[0]] === grids[pattern[1]] &&
            grids[pattern[1]] === grids[pattern[2]];
    });
}

function updatePlayerScore() {
playerScore = playerScore > 0 ? playerScore -= 1 : 0;
}

function floodFill(grid, gridCoordinate, colorToChange) { 
    if (arraysAreEqual(colorToChange, replacementColor)) { return } //The current cell is already the selected color
    else if (!arraysAreEqual(grid[gridCoordinate.row * CELLS_PER_AXIS + gridCoordinate.column], colorToChange)) { return }  //The current cell is a different color than the initially clicked-on cell
    else {
        grid[gridCoordinate.row * CELLS_PER_AXIS + gridCoordinate.column] = replacementColor;
        floodFill(grid, {column: Math.max(gridCoordinate.column - 1, 0), row: gridCoordinate.row}, colorToChange);
        floodFill(grid, {column: Math.min(gridCoordinate.column + 1, CELLS_PER_AXIS - 1), row: gridCoordinate.row}, colorToChange);
        floodFill(grid, {column: gridCoordinate.column, row: Math.max(gridCoordinate.row - 1, 0)}, colorToChange);
        floodFill(grid, {column: gridCoordinate.column, row: Math.min(gridCoordinate.row + 1, CELLS_PER_AXIS - 1)}, colorToChange);
    }
    return
}

function restart() {
    startGame(grids[0]);
}

// #endregion


// *****************************************************************************
// #region Event Listeners

canvas.addEventListener("mousedown", gridClickHandler);
function gridClickHandler(event) {
     updatePlayerScore();
    updateGridAt(event.offsetX, event.offsetY);
}

restartButton.addEventListener("mousedown", restartClickHandler);
function restartClickHandler() {
    restart();
}

undoButton.addEventListener("mousedown", undoLastMove);
function undoLastMove() {
    rollBackHistory();
}

rotateButton.addEventListener("mousedown", rotateGrid);
function rotateGrid() {
    transposeGrid();
}

colorSelectButtons.forEach(button => {
    button.addEventListener("mousedown", () => replacementColor = CELL_COLORS[button.name])
});

// #endregion


// *****************************************************************************
// #region Helper Functions

// To convert canvas coordinates to grid coordinates
function convertCartesiansToGrid(xPos, yPos) {
    return {
        column: Math.floor(xPos/CELL_WIDTH),
        row: Math.floor(yPos/CELL_HEIGHT)
    };
}

// To choose a random property from a given object
function chooseRandomPropertyFrom(object) {
    const keys = Object.keys(object);
    return object[keys[ Math.floor(keys.length * Math.random()) ]]; //Truncates to integer
};

// To compare two arrays
function arraysAreEqual(arr1, arr2) {
    if (arr1.length != arr2.length) { return false }
    else {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }
}

// #endregion

//Start game
startGame();

});
})();