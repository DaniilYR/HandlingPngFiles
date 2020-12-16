// получаем доступ к холсту
const game = document.getElementById('Canvas');
const context = game.getContext('2d');
// получаем доступ к малому холсту
const canvas = document.getElementById("smallCanvas");
const ctx = canvas.getContext('2d');

// размер квадратика
const grid = 30;

// массив с последовательностями фигур, на старте — пустой
var tetrominoSequence = [];

// с помощью двумерного массива следим за тем, что находится в каждой клетке игрового поля
// размер поля — 10 на 20, и несколько строк ещё находится за видимой областью
var playfield = [];
// заполняем сразу массив пустыми ячейками
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

// задаём формы для каждой фигуры
const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};


// цвет каждой фигуры
// https://w3schoolsrus.github.io/colors/colors_names.html#gsc.tab=0
const colors = {
    'I': 'tomato',
    'O': 'khaki',
    'T': 'steelblue',
    'S': 'green',
    'Z': 'darkseagreen ',
    'J': 'indigo',
    'L': 'mediumspringgreen'
};

// счётчик
let count = 0;
// очки
let score = 0;
// число собранных линий
let lines = 0;
// уровень инры
let level = 1;
// скоорость падения фигур
let speed = 70;
// число записей в таблице рекордов
let countRecords = 0;
// резерв фигуры
let reserveTetromino = 'N';

let flag = true;
// получаем первый блок
let tetromino = getNextTetromino();

// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
// флаг конца игры, на старте — false
let gameOver = false;

// Функция возвращает случайное число в заданном диапазоне
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// создаём последовательность фигур, которая появится в игре
function generateSequence() {
    // тут — сами фигуры
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        // случайным образом находим любую из них
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        // помещаем выбранную фигуру в игровой массив с последовательностями
        tetrominoSequence.push(name);
    }
    if(reserveTetromino !== 'N'){
        tetrominoSequence.push(reserveTetromino);
    }
}

// получаем следующую фигуру
function getNextTetromino() {
    // если следующей нет — генерируем
    if (tetrominoSequence.length === 0) {
        flag = true;
        generateSequence();
    }

    // берём первую фигуру из массива
    const name = tetrominoSequence.pop();
    // сразу создаём матрицу, с которой мы отрисуем фигуру
    const matrix = tetrominos[name];

    //получаем следующею фигуру
    let nextName;
    let nextMatrix;
    if (tetrominoSequence.length >= 2){
        // достаем из массива след фигуру
        nextName = tetrominoSequence.pop();
        // для дальнейшего испрользования возвращаем ее
        tetrominoSequence.push(nextName);
        // создаём матрицу, с которой мы отрисуем фигуру
        nextMatrix = tetrominos[nextName];
    }
    else {
        // если очередь фигур заканчивается сохраняем предпоследнюю фигуру в резерв
        if(flag) {
            reserveTetromino = name;
            flag = false;
        }
        if (tetrominoSequence.length >= 1){
            nextName = tetrominoSequence.pop();
            tetrominoSequence.push(nextName);
            nextMatrix = tetrominos[nextName];
        }
        else {
            nextName = reserveTetromino;
            nextMatrix = tetrominos[nextName];
        }
    }


    // I и O стартуют с середины, остальные — чуть левее
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = name === 'I' ? -1 : -2;

    // вот что возвращает функция
    return {
        name: name,      // название фигуры (L, O, и т.д.)
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартуют за видимой областью холста)
        col: col,         // текущий столбец
        nextName: nextName, // название след фигуры
        nextMatrix: nextMatrix // матрица со след фигурой
    };
}

// поворачиваем матрицу на 90 градусов
// https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    // на входе матрица, и на выходе тоже отдаём матрицу
    return result;
}

// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
    // проверяем все строки и столбцы
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // если выходит за границы поля…
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // …или пересекается с другими фигурами
                playfield[cellRow + row][cellCol + col])
            ) {
                // то возвращаем, что нет, так не пойдёт
                return false;
            }
        }
    }
    // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
    return true;
}

// когда фигура окончательна встала на своё место
function placeTetromino() {
    // обрабатываем все строки и столбцы в игровом поле
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                // если край фигуры после установки вылезает за границы поля, то игра закончилась
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }
                // если всё в порядке, то записываем в массив игрового поля нашу фигуру
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    // проверяем, чтобы заполненные ряды очистились снизу вверх
    for (let row = playfield.length - 1; row >= 0; ) {
        // если ряд заполнен
        if (playfield[row].every(cell => !!cell)) {

            // очищаем его и опускаем всё вниз на одну клетку
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r-1][c];
                }
            }
            score+=10;
            lines++;
        }
        else {
            // переходим к следующему ряду
            row--;
        }
    }
    // переписываем число очков
    document.getElementById("tetris_point").innerHTML = "Очки: " + score;
    // поднимаем уровень и меняем скорость падения, если это необходимо
    if(lines >= 10){
        level++;
        lines = 0;
        if(speed > 7)
            speed -= 5;
    }
    // получаем следующую фигуру
    tetromino = getNextTetromino();
}

// показываем надпись Game Over
function showGameOver() {
    // прекращаем всю анимацию игры
    cancelAnimationFrame(rAF);
    // ставим флаг окончания
    gameOver = true;
    // рисуем чёрный прямоугольник посередине поля
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, game.height / 2 - 30, game.width, 60);
    // пишем надпись белым моноширинным шрифтом по центру
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', game.width / 2, game.height / 2);
    countRecords++;
    update_records();
}

function update_records() {

    // если мы уже сыграли
    if(countRecords > 0) {
        // создаем новыю запись с ррзультатом
        let currentRecord = localStorage.getItem("gamer_name") + " - " + score;
        if (localStorage.hasOwnProperty("table")) {
            let record = localStorage.getItem("table");
            // дополняем табоицу
            //alert(typeof Number.parseInt(record[record.length-1]) +" "+ Number.parseInt(record[record.length-1]));
            //alert(typeof score + " " + score);
            //alert(record.lastIndexOf(" "));
            let sr = '';
            for(let i = record.lastIndexOf(" ")+1; i < record.length; i++){
                sr += record[i];
            }
            if(Number.parseInt(sr) < score)
                localStorage.setItem("table",  currentRecord);
        } else {
            //если таблица была пуста, заносим запись
            localStorage.setItem("table", currentRecord);
        }
        // если записей много, очизаем тблицу
        if(localStorage.getItem("table").length <= 230){
            document.getElementById('table').innerHTML = localStorage.getItem("table");
        }
        else {
            let saveName = localStorage.getItem("gamer_name");
            localStorage.clear();
            localStorage.setItem("gamer_name", saveName);
        }
    }
    document.getElementById('table').innerHTML = localStorage.getItem("table");

}

// следим за нажатиями на клавиши
document.addEventListener('keydown', function(e) {
    // если игра закончилась — сразу выходим
    if (gameOver) return;

    // стрелки влево и вправо
    if (e.which === 37 || e.which === 39) {
        // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
        const col = e.which === 37 ? tetromino.col - 1 : tetromino.col + 1;

        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // стрелка вверх — поворот
    if (e.which === 38) {
        // поворачиваем фигуру на 90 градусов
        const matrix = rotate(tetromino.matrix);
        // если так ходить можно — запоминаем
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    // стрелка вниз — ускорить падение
    if(e.which === 40) {
        // смещаем фигуру на строку вниз
        const row = tetromino.row + 1;
        // если опускаться больше некуда — запоминаем новое положение
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            // ставим на место и смотрим на заполненные ряды
            placeTetromino();
            return;
        }
        // запоминаем строку, куда стала фигура
        tetromino.row = row;
    }
});

// Рисуем след фигуру
function drawNextTetromino() {
    // очищаем малый холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // устанавливаем цвет
    ctx.fillStyle = colors[tetromino.nextName];
    // устанавливаем смещение
    let x = 30;
    let y = 45;
    if(tetromino.nextName === 'I'){
         x = 15;
         y = 30;
    }
    if(tetromino.nextName === 'O'){
         x = 45;
         y = 45;
    }

    for (let row = 0; row < tetromino.nextMatrix.length; row++) {
        for (let col = 0; col < tetromino.nextMatrix.length; col++) {
            if (tetromino.nextMatrix[row][col]) {
                // и снова рисуем на один пиксель меньше
                ctx.fillRect( x + (col * grid), y + (row * grid), grid - 1, grid - 1);
            }
        }
    }
}

// главный цикл игры
function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // выводим уровень и очки
    document.getElementById("tetris_point").innerHTML = "Очки: " + score;
    document.getElementById("tetris_level").innerHTML = "Уровень: " + level;
    // очищаем холст
    context.clearRect(0,0,game.width,game.height);

    // рисуем игровое поле с учётом заполненных фигур
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];

                // рисуем всё на один пиксель меньше
                context.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }

    // рисуем текущую фигуру

    if (tetromino) {

        // рисуем след фигуру
        drawNextTetromino();

        // фигура сдвигается вниз с установленной скоростью (в кадрах)

        if (++count > speed) {
            tetromino.row++;
            count = 0;

            // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        // устанавливаем цвет текущей фигуры
        context.fillStyle = colors[tetromino.name];

        // отрисовываем её
        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {

                    // рисуем на один пиксель меньше
                    context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
                }
            }
        }
    }
}

rAF = requestAnimationFrame(loop);
// вывод таблици результатов

update_records();
// вывод имени игрока
let name = localStorage.getItem("gamer_name");
document.getElementById("gamer_name").innerHTML = "Игрок: " + name;