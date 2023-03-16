const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]
const pieces = []

const grid = document.querySelector(".grid")
const turn = document.querySelector(".turn")
turn.textContent = "Red";
turn.classList.add("red")
let currentIndex
const width = 7;
let pieceIndex = 3;
let color = "red"
let isDisabled = false


function createSquare() {
    for (let i = 0; i < 49; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("id", squares[i]);
        pieces.push(square)
        grid.appendChild(square);
    }

}

function hideSquare() {
    for (let j = 49; j < squares.length; j++) {
        let square = document.createElement("div");
        square.classList.add("piece")
        square.classList.add("hidden")
        square.classList.add("square");
        square.setAttribute("id", squares[j]);
        pieces.push(square)
        grid.appendChild(square);
    }
}

function placeRedPiece() {
    pieces[pieceIndex].classList.add("red");
    pieces[pieceIndex].classList.add("piece");
}

function placeYellowPiece() {
    pieces[pieceIndex].classList.add("yellow");
    pieces[pieceIndex].classList.add("piece");
}

createSquare();
hideSquare();
placeRedPiece();


function dropPiece(e) {
    if (isDisabled) {
        return;
    }
    let dropId
    let currentDropIndex = pieceIndex
    function fallingPiece() {
        if (!pieces[currentDropIndex + width].classList.contains("piece")) {
            pieces[currentDropIndex].classList.remove("piece")
            pieces[currentDropIndex].classList.remove(color)
            currentDropIndex += width
            pieces[currentDropIndex].classList.add("piece")
            pieces[currentDropIndex].classList.add(color)
        }
        if (pieces[currentDropIndex + width].classList.contains("piece")) {
            clearInterval(dropId);
            if (winCheckAll()) {
                // displayWin();
                // displayResetBtn();
                return
            }
            updateGameState();
        }

    }

    if (e.key === "Enter") {
        isDisabled = true;
        dropId = setInterval(fallingPiece, 50)

    }
}


function updateGameState() {
    pieceIndex = 3
    isDisabled = false;
    if (turn.textContent === "Red") {
        turn.textContent = "Yellow"
        turn.classList.remove("red")
        turn.classList.add("yellow")
        color = "yellow"
        placeYellowPiece();
    } else {
        turn.textContent = "Red"
        turn.classList.remove("yellow")
        turn.classList.add("red")
        color = "red"
        placeRedPiece();
    }

    return color;
}



function movePiece(e) {
    if (isDisabled) {
        return;
    }
    pieces[pieceIndex].classList.remove("piece")
    pieces[pieceIndex].classList.remove(color)
    switch (e.key) {
        case "ArrowLeft":
            if (pieceIndex > 0) {
                pieceIndex -= 1
            } break;
        case "ArrowRight":
            if (pieceIndex < 6) {
                pieceIndex += 1
            } break;
    }
    pieces[pieceIndex].classList.add("piece")
    pieces[pieceIndex].classList.add(color)

}

document.addEventListener("keydown", movePiece)
document.addEventListener("keydown", dropPiece)

//win conditions
//4 in a row horiz, vert, diag
//if any are the same we know the game is over
//we can check those squares
//from any given square, you can check if there is 4 right, 4 above, 4 diag right up.
//run for loop from 0-49 
//check if there are 4 same colors in a row for each square right, up, up right diag
//if yes, win and stop iteration -- can use "break" after (if condition is met statement)
// as long as is less than last square in row

//row Math.floor(index / width) //if row is same keep going 
//if row is different stop
//above - width //if >= 7 keep looping
//if < 7 stop
//diag - width + 1 //you know it's overflowed when rows match
//if get row for current index and next index are different keep looping
//if they are the same than stop
//if >= 7 keep going
// if < 7 stop
//Math.floor(index /)

function getRow(index) {
    return Math.floor(index / width);
}

function getColor(index) {
    const element = pieces[index]
    if (element === undefined) {
        return null;
    }
    return element.classList.contains("yellow") ? "yellow" : element.classList.contains("red") ? "red" : null
}

function winCheckRow(index) {
    let color = getColor(index);
    let row = getRow(index);
    for (i = index + 1; i < index + 4; i++) {
        let nextRow = getRow(i);
        if (nextRow !== row) {
            return false;
        }

        const nextColor = getColor(i);
        if (!nextColor || color !== nextColor) {
            return false;
        }
        console.log({ color, row, nextColor, nextRow })
        row = nextRow
        color = nextColor
    }
    return true;
}

function winCheckAll() {
    for (let i = 7; i < squares.length; i++) {
        if (winCheckRow(i)) {
            return true;
        }
    }
    return false;
}