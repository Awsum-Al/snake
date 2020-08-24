import React from 'react';
import './styles.scss';

interface Coordinates {
    row: number;
    col: number;
}

interface SnakeVelocity {
    vx: number;
    vy: number;
}

const Board/*: React.FC*/ = () => {

    const [grid, setGrid] = React.useState<Coordinates[][]>();
    const [snakeHead, setsnakeHead] = React.useState<Coordinates>({ col: 10, row: 5 });
    const [tailArray, settailArray] = React.useState<Coordinates[]>([
        { row: 5, col: 9 },
        { row: 5, col: 8 },
        { row: 5, col: 7 }
    ]
    );

    const [food, setFood] = React.useState<Coordinates>({ col: -1, row: -1 });
    const [tick, setTick] = React.useState<number>(0);
    const [snakeVelocity, setsnakeVelocity] = React.useState<SnakeVelocity>({ vx: 0, vy: 0 });
    const [lost, setLost] = React.useState<boolean>(false);
    const [pause, setPause] = React.useState<boolean>(false);
    const [restart, setRestart] = React.useState<boolean>(false);
    const pauseButton = () => (pause ? [setPause(false), document.addEventListener('keydown', onKeyDown)] : [setPause(true), document.removeEventListener('keydown', onKeyDown), setsnakeVelocity({ vx: 0, vy: 0 })])
    const restartButton = () => [(setRestart(true), setsnakeHead({row: 5, col: 10}), settailArray([{row: 5, col: 9}, {row: 5, col: 8}, {row: 5, col: 7}]), setLost(false), setsnakeVelocity({vx: 0, vy: 0}), setTick(0))]
    
    // eslint-disable-next-line
    React.useEffect(() => { initGrid(); placeFood(); const timer = window.setInterval(() => { setTick(prevState => prevState + 1); }, 800); document.addEventListener('keydown', onKeyDown); return () => { document.removeEventListener('keydown', onKeyDown); window.clearInterval(timer); } }, [restart])
    // eslint-disable-next-line
    React.useEffect(() => { moveSnakeHead(); movebody(); gameLogic();}, [tick])

    const placeFood = () => {
        setFood({
            row: Math.floor(Math.random() * 50),
            col: Math.floor(Math.random() * 50)
        })
    }

    const initGrid = () => {
        const grid = [];
        for (
            let row = 0;
            row < 50;
            row++
        ) {
            const cols = [];
            for (
                let col = 0;
                col < 50;
                col++
            ) {
                cols.push({ row, col });
            }
            grid.push(cols);
        }
        setGrid(grid);
    }

    const drawGrid = () => {
        return (
            grid && grid.map((row) =>
                row.map((coords) => {
                    return (
                        <div className={`${getObjectStyleInCell(coords)}`} key={`${coords.row} - ${coords.col}`}>  </div >
                    )
                }
                )
            )
        )
    }


    const getObjectStyleInCell = (loc: Coordinates) => {
        let tempClass: string = ''
        let x = loc.row
        let y = loc.col
        let tailFound = tailArray.find((tail) => { return (x === tail.row && y === tail.col) })

        if (loc.row === snakeHead.row && loc.col === snakeHead.col) {
            tempClass = 'snake-head'
        }
        else if (tailFound) {
            tempClass = 'snake-tail'
        }
        else if (loc.row === food.row && loc.col === food.col) {
            tempClass = 'food'
        }
        else if (snakeHead.row >= 0 && snakeHead.row < 50 && snakeHead.col >= 0 && snakeHead.col < 50) {
            tempClass = 'cell'
        }
        else {
            tempClass = 'null'
        }
        return tempClass
    }

    // Set the snake velocity. Origin is top left 
    const onKeyDown = React.useCallback(event => {
        const { key } = event;
        
        if (key === "ArrowLeft") {
            setsnakeVelocity({ vx: -1, vy: 0 })
        }
        else if (key === "ArrowRight") {
            setsnakeVelocity({ vx: 1, vy: 0 })
        }
        else if (key === "ArrowUp") {
            setsnakeVelocity({ vx: 0, vy: -1 })
        }
        else if (key === "ArrowDown") {
            setsnakeVelocity({ vx: 0, vy: 1 })
        }
    }, []);

    const moveSnakeHead = () => {
        if (pause) { setsnakeVelocity({ vx: 0, vy: 0 }) }
        if (snakeVelocity.vx !== 0 || snakeVelocity.vy !== 0) {
            let x = snakeHead.row + snakeVelocity.vy
            let y = snakeHead.col + snakeVelocity.vx
            setsnakeHead({ row: x, col: y })
        }
    }
    const movebody = () => {
        if (snakeVelocity.vx !== 0 || snakeVelocity.vy !== 0) {
            let tempbody = tailArray.map(z => Object.assign({}, z));
            tempbody.unshift(snakeHead)
            tempbody.pop()
            //  temptail2 = tempbody.map(z => Object.assign({}, z));
            settailArray(tempbody)
        }
    }
    const gameLogic = () => {
        let x = snakeHead.row
        let y = snakeHead.col
        let temptail = tailArray.map(z => Object.assign({}, z));
        // The shift removes the first tail section. This avoids collision detections while going in a straight line.
        temptail.shift()
        let tailFound = temptail.find((tail) => { return (x === tail.row && y === tail.col) })
        // #1 Food
        if (snakeHead.row === food.row && snakeHead.col === food.col) {
            settailArray(prevState => ([...prevState, { col: -1, row: -1 }]))
            placeFood()
        }
        // #2 The Wall
        else if (snakeHead.row < 0 || snakeHead.row > 50 || snakeHead.col < 0 || snakeHead.col > 50) {
            console.log('You hit the wall')
            setLost(true)
        }
        // #3 The Tail
        else if (tailFound) {
            console.log('You hit your tail')
            setLost(true)
        }
    }

    var snake_grid = (
        <body>
            <div>
                <div className='board-background'>
                    {grid && drawGrid()}
                </div>
                <button className='button' onClick={() => { pauseButton(); }} id='one'>
                    {pause ? 'Go' : 'Pause'}
                </button>
                <button className='button' onClick={() => { restartButton(); }} id='two'>
                    Restart
                </button>
                <button className='button' onClick={() =>window.location.href = ('https://pointerpointer.com/')} id='three'>
                    Quit
                </button>
            </div>
        </body>
    );

    var game_over = (
        <body>

            <div id="GO">

                <div className="gameover">
                    <p> GAME </p>
                    <p> OVER </p>
                </div>

                <div className="continue"> <p> CONTINUE? </p> </div>

                <div className="button2">
                    <div className="yes" onClick={() => { restartButton(); }}> <b>YES</b> </div>
                    <div className="no"> <a href='https://pointerpointer.com/'> NO </a> </div>
                </div>

            </div>
        </body>

    )

    var ternary = lost ? game_over : snake_grid;

    return ternary;

}

export default Board
