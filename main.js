let rectW;
let rectH;
let rows;
let cols;
let cellsMatrix;
let antPos;
let antDir;
let directions = {
    north: {false: [1, 0], true: [-1, 0]},
    east: {false: [0, 1], true: [0, -1]},
    south: {false: [-1, 0], true: [1, 0]},
    west: {false: [0, -1], true: [0, 1]},
};
let directionsOrder = ['north', 'east', 'south', 'west'];
let startState;

class Cell {
    constructor(xPos, yPos, width, height, filled) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.filled = filled;
    }

    draw() {
        rect(this.xPos, this.yPos, this.width, this.height);
    }
}

function countFilledNeighbours(cell) {
    let x = Math.floor(cell.xPos / rectW);
    let y = Math.floor(cell.yPos / rectH);

    if (x > 0 && y > 0 && x < cellsMatrix.length - 1 && y < cellsMatrix[0].length - 1) {
        filledNorth = cellsMatrix[x][y - 1].filled;
        filledEast = cellsMatrix[x + 1][y].filled;
        filledSouth = cellsMatrix[x][y + 1].filled;
        filledWest = cellsMatrix[x - 1][y].filled;
        filledNortheast = cellsMatrix[x + 1][y - 1].filled;
        filledNorthwest = cellsMatrix[x - 1][y - 1].filled;
        filledSoutheast = cellsMatrix[x + 1][y + 1].filled;
        filledSouthWest = cellsMatrix[x - 1][y + 1].filled;
        collectFilled = [filledNorth, filledEast, filledSouth, filledWest, filledNortheast, filledNorthwest, filledSoutheast, filledSouthWest];
        countFilled = collectFilled.filter(el => el === true).length;
    } else {
        countFilled = 0;
    }

    return countFilled;
}

function setup() {
    frameRate(30);
    rectW = 10;
    rectH = 10;
    rows = windowWidth / rectH;
    cols = windowHeight / rectW;
    startState = [
        `${Math.floor(rows / 2 + 1)},${Math.floor(cols / 2 + 1)}`,
        `${Math.floor(rows / 2 + 2)},${Math.floor(cols / 2 + 1)}`,
        `${Math.floor(rows / 2 + 3)},${Math.floor(cols / 2 + 1)}`,
        `${Math.floor(rows / 2 - 1)},${Math.floor(cols / 2 + 1)}`,
        `${Math.floor(rows / 2 - 1)},${Math.floor(cols / 2 + 2)}`,
        `${Math.floor(rows / 2 - 1)},${Math.floor(cols / 2 + 3)}`,

    ];

    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.class('canvas-block');

    cellsMatrix = [];
    stroke(0, 0, 0, 50);
    for (let r = 0; r < rows; r++) {
        cellsMatrix.push([]);
        for (let c = 0; c < cols; c++) {
            let filled = startState.indexOf(`${r},${c}`) !== -1;
            fill(filled ? color(0) : color(255));
            let cell = new Cell(r * rectW, c * rectH, rectW, rectH, filled);
            cellsMatrix[r].push(cell);
            cell.draw();
        }
    }
}

function draw() {
    let newCells = [];
    let spliceCells = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let filled = cellsMatrix[r][c].filled;
            let countFilled = countFilledNeighbours(cellsMatrix[r][c]);
            if (filled) {
                if (countFilled < 2) {
                    let cell = new Cell(r * rectW, c * rectH, rectW, rectH, !filled);
                    let fillColor = color(filled ? color(255) : color(0));
                    spliceCells.push({y: r, x: c, cell: cell, fillColor: fillColor});

                } else if (countFilled === 2 || countFilled === 3) {

                } else if (countFilled > 3) {
                    let cell = new Cell(r * rectW, c * rectH, rectW, rectH, !filled);
                    let fillColor = color(filled ? color(255) : color(0));
                    spliceCells.push({y: r, x: c, cell: cell, fillColor: fillColor});
                }
            } else {
                if (countFilled === 3) {
                    let cell = new Cell(r * rectW, c * rectH, rectW, rectH, !filled);
                    let fillColor = color(filled ? color(255) : color(0));
                    spliceCells.push({y: r, x: c, cell: cell, fillColor: fillColor});
                }
            }
        }
    }

    spliceCells.forEach(c => {
        fill(c.fillColor);
        cellsMatrix[c.y].splice(c.x, 1, c.cell);
        c.cell.draw();
    })
}