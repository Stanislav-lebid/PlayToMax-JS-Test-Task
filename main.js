class GameBoard {
    constructor(board) {
        this.board = board;
        this.rows = board.length;
        this.cols = board[0].length;
        this.renderBoard();
    }

    isValid(x, y) {
        return x >= 0 && y >= 0 && x < this.rows && y < this.cols;
    }

    findGroup(x, y, element, visited) {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0] // Праворуч, вниз, ліворуч, вгору
        ];

        let group = [[x, y]];
        visited[x][y] = true;

        for (let [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (this.isValid(newX, newY) && !visited[newX][newY] && this.board[newX][newY] === element) {
                group = group.concat(this.findGroup(newX, newY, element, visited));
            }
        }

        return group;
    }

    removeGroup(group) {
        for (let [x, y] of group) {
            this.board[x][y] = null;
        }
        this.renderBoard(); 
    }

    removeElements(x, y) {
        const element = this.board[x][y];
        if (element === null) {
            console.log("Порожня комірка.");
            return;
        }

        const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
        const group = this.findGroup(x, y, element, visited);

        
        this.removeGroup(group);
        console.log(`Видалено групу з ${group.length} елементів.`);
    }

    renderBoard() {
        const gameBoardDiv = document.getElementById('game-board');
        gameBoardDiv.innerHTML = ''; 

        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.classList.add(cell || 'empty'); 

                if (cell !== null) {
                    cellDiv.textContent = cell;
                }

                cellDiv.addEventListener('click', () => {
                    this.removeElements(rowIndex, colIndex);
                });

                gameBoardDiv.appendChild(cellDiv);
            });
        });
    }
}

function getRandomElement() {
    const elements = ['A', 'B', 'C', 'D'];
    return elements[Math.floor(Math.random() * elements.length)];
}

function generateBoard(rows, cols) {
    const board = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(getRandomElement());
        }
        board.push(row);
    }
    return board;
}

const board = generateBoard(10, 10);
const gameBoard = new GameBoard(board);
