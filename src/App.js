import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick} onMouseDown={(e) => e.preventDefault()}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, boardSize }) {
    function checkWinner(sqs) {
        const size = Math.sqrt(sqs.length);
        const lines = [];

        // Generate lines for rows
        for (let i = 0; i < size; i++) {
            lines.push(sqs.slice(i * size, i * size + size));
        }

        // Generate lines for columns
        for (let i = 0; i < size; i++) {
            const column = [];
            for (let j = 0; j < size; j++) {
                column.push(sqs[i + j * size]);
            }
            lines.push(column);
        }

        // Generate lines for diagonals
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < size; i++) {
            diagonal1.push(sqs[i * size + i]);
            diagonal2.push(sqs[i * size + size - i - 1]);
        }
        lines.push(diagonal1, diagonal2);

        // Check each line for a winner
        for (const line of lines) {
            if (line.every((value) => value !== null && value === line[0])) {
                return line[0]; // Return the winner
            }
        }

        // No winner
        return null;
    }

    function handleClick(i) {
        if (squares[i] || checkWinner(squares)) {
            return;
        }

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = checkWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else if (!squares.includes(null)) {
        status = "Bruh";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <center>
            <div className="status">{status}</div>
            <br></br>
            {Array.from({ length: Math.sqrt(boardSize) }).map((_, i) => (
                <div className="board-row" key={i}>
                    {Array.from({ length: Math.sqrt(boardSize) }).map((_, j) => {
                        const index = i * Math.sqrt(boardSize) + j;
                        return (
                            <Square
                                key={index}
                                value={squares[index]}
                                onSquareClick={() => handleClick(index)}
                            />
                        );
                    })}
                </div>
            ))}
        </center>
    );
}



function History ({setX, setCurrentSquares, setHistory, updateBoard, history}) {

    function histClick(i) {
        setCurrentSquares(history[i]);
        setHistory(history.slice(0, i + 1));
        console.log(history)
        setX(i%2 === 0);
    }

    return (
        <center>
            {history.map((_, i) => (
                <button className='histButton' key={i} onClick={() => histClick(i)}>{
                    i === 0 ? 'N' : i
                }</button>
            ))}
        </center>
    );
}

export default function Game() {
    const side = 3
    const boardSize = side * side; // Set your board size here
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(boardSize).fill(null)]);
    const [currentSquares, setCurrentSquares] = useState(history[history.length - 1]);

    function handlePlay(nextSquares) {
        setHistory([...history, nextSquares]);
        setCurrentSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    return (
        <div>
            <div className='main'>
                <div className='header'>
                        Welcome to Tic Tac Toe
                </div>
                <div className='board'>
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={boardSize} />
                </div>
                <br></br>
                <div className='history'> 
                    <History setX={setXIsNext} setCurrentSquares={setCurrentSquares} setHistory={setHistory} updateBoard={handlePlay} history={history} />
                </div>
            </div>
        </div>
    );
}
