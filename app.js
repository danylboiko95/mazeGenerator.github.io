
elements = {
    maze: document.getElementById('maze'),
    container: document.getElementById('container'),
    finish: document.getElementById('finish'),
    find: document.querySelector('.find')
}

const state = {
    startCoordinates: {
        row: 0,
        column: 0
    },
    finishCoordinates: {
        row: 0,
        column: 0
    },
    player: {
        row: 0,
        column: 0
    },


    path: {
        row: [],
        column: []
    }

};

class Maze {
    constructor(width, height) {
        this.mazeArr = [];
        this.size = 25;
    }

    generateMap() {
        for (let j = 0; j < this.size; j++) {//создание двумерного массива
            this.mazeArr[j] = [];
        }
        for (let j = 0; j < this.size; j++) {//заполнение массива
            for (let i = 0; i < this.size; i++) {
                let number = 3;//закрытый блок
                this.mazeArr[j][i] = number;
                this.mazeArr[j][i] = document.createElement('div');

                this.mazeArr[j][i].classList += `block`;

                elements.maze.appendChild(this.mazeArr[j][i]);
            }
        }
    }
    initBeginFinish() {
        let start = this.mazeArr[this.size - 3][0];//из-за того, что заранее не продумал, что надо будет делать четное количество блоков. задал высоту 25. Четное надо, так как возможность прохода считается как отдельный блок
        let finish = this.mazeArr[0][this.size - 1];
        start.id = 'start';
        finish.id = 'finish';

        for (let j = 0; j < this.size; j++) {//назначить в state координаты старта
            for (let i = 0; i < this.size; i++) {
                if (this.mazeArr[j][i].id === 'start') {
                    state.startCoordinates.row = j;
                    state.startCoordinates.column = i;
                }
                if (this.mazeArr[j][i].id === 'finish') {
                    state.finishCoordinates.row = j;
                    state.finishCoordinates.column = i;
                }
            }
        }
    }
    createPath() {
        let moveColumn = 0;
        let moveRow = 0;
        for (let i = 0; i < (this.size); i++) {//как раз для заполнения лабиринта сеткой
            moveColumn = 0;
            for (let j = 0; j < (this.size); j++) {
                if (moveColumn < this.size && moveRow < this.size) {
                    this.mazeArr[moveRow][moveColumn].classList += ' move';
                    moveColumn += 2;
                }
            }

            moveRow += 2;
        }


        moveRow = 0;
        moveColumn = 0;
        for (let i = 0; i < (this.size); i++) {//сама генерация лабиринта
            moveColumn = 0;

            for (let j = 0; j < (this.size); j++) {
                if (this.random(2, 0) && moveRow > 0 && moveRow < (this.size - 1) && !this.mazeArr[moveRow - 1][moveColumn].classList.contains('move')) {
                    this.mazeArr[moveRow - 1][moveColumn].classList += ' move';
                    if (moveColumn < this.size - 1) {
                        moveColumn += 2;
                    }
                } else if (moveColumn < this.size - 1) {
                    this.mazeArr[moveRow][moveColumn + 1].classList += ' move';
                    moveColumn += 2;
                }
            }
            if (moveRow < this.size - 1) {
                moveRow += 2;
            }
        }


    }


    movePlayer() {
        state.player.row = state.startCoordinates.row;
        state.player.column = state.startCoordinates.column;
        document.addEventListener('keydown', (e) => {//не знаю как снять событие. Вроде добавляю document.addEventListener('keydown', this.onMove(e)); А потом addEventListener. Но всё равно не получается как хочу. Так как при  этом варианте (e) не передается как параметр. 
            this.onMove(e);
        })
        // console.log(state.player);
    }
    onMove(event) {
        if (event.keyCode == 38) {
            if (state.player.row != 0) {
                this.canMove(-1, 0)//UP
            }
            console.log(state.player);
        }
        if (event.keyCode == 40) {
            if (state.player.row != this.size - 1) {
                this.canMove(1, 0);//down
            }
            console.log(state.player);
        }
        if (event.keyCode == 37) {
            if (state.player.column != 0) {
                this.canMove(0, -1);//left
            }
            console.log(state.player);
        }
        if (event.keyCode == 39) {
            if (state.player.column != this.size - 1) {
                this.canMove(0, 1)//right               
            }

        }
    }
    canMove(row, column) {

        if (this.mazeArr[state.player.row + row][state.player.column + column].classList.contains('move') || this.mazeArr[state.player.row + row][state.player.column + column].id === 'finish') {
            if (this.mazeArr[state.player.row][state.player.column].classList.remove('player')) {//если можно удалить, то удаляй
                this.mazeArr[state.player.row][state.player.column].classList.remove('player')
            };
            this.mazeArr[state.player.row + row][state.player.column + column].classList += ' player';
            state.player.row += row;
            state.player.column += column;
        }
        this.win();
    }

    random(multiply, sum) {//просто для удобства
        return Math.floor(Math.random() * multiply) + sum;
    }

    win() {

        if (state.finishCoordinates.row === state.player.row && state.finishCoordinates.column === state.player.column) {

            finish.id = 'win';
            elements.container.innerHTML = '';
            const markup = `
                <div class="winGame">THANK YOU, MARIO!</div>
            `
            elements.container.insertAdjacentHTML('afterbegin', markup);


        }
    }
    startGame() {
        this.generateMap();
        this.initBeginFinish();
        this.createPath();
        this.movePlayer();
    }

    findPath() {
        let currentRow = state.player.row;
        let currentColumn = state.player.column;
        let k = 1;

        let timerId = setInterval(() => {//анимация
            if (currentRow > 0 && this.mazeArr[currentRow - 1][currentColumn].classList.contains('move')) {
                this.mazeArr[currentRow - 1][currentColumn].style.color = 'black';
                this.mazeArr[currentRow - 1][currentColumn].textContent = `${k++}`;
                currentRow--;

            }
            if (currentColumn < this.size - 1 && this.mazeArr[currentRow][currentColumn + 1].classList.contains('move')) {
                this.mazeArr[currentRow][currentColumn + 1].style.color = 'black';
                this.mazeArr[currentRow][currentColumn + 1].textContent = `${k++}`;
                currentColumn++;

            }
            if (currentRow == state.finishCoordinates.row && currentColumn == state.finishCoordinates.column) {
                clearInterval(timerId);
                console.log('hello');
            }
        }, 25);
    }

    clearTextContent() {
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                this.mazeArr[j][i].textContent = '';//очистка от чисел

            }
        }
    }
}



const game = new Maze();

game.startGame();


elements.find.addEventListener('click', () => {
    game.clearTextContent();
    game.findPath();
});


