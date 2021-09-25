import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './indexHooks.js';


class Square extends React.Component {
  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    this.props.handleClick(e, this.props.el_index);
  }

  render() {
    return (
      <button
       className="square"
       onClick={this.handleClick}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props){
    super(props);

    this.handleClickSquare = this.handleClickSquare.bind(this);
  }

  renderSquare(i) {
    return( 
            <Square
             el_index={i}
             handleClick={this.handleClickSquare}
             value={this.props.squares[i]}
            /> 
          );
  }

  handleClickSquare(e, el_index){
    this.props.handleClickSquare(e, el_index);
  }

  render() {
    
   return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);

    this.handleClickSquare = this.handleClickSquare.bind(this);
    this.handleClickNewMatch = this.handleClickNewMatch.bind(this);

    this.state = this.generateInitialState();
  }

  handleClickSquare(e, el_index){
    //e.preventDefault();
    //console.log("ciao");
    if( this.state.matchFinished && (this.state.stepNumber+1 )===this.state.history.length ){
      return;
    }
    this.setState( (actualState) => {

                                      let history = actualState.history.slice( 0, actualState.stepNumber + 1 );
                                      const current = history[history.length - 1];
                                      const squares = current.squares.slice();

                                      let matchFinished;
                                      let xIsNext = actualState.xIsNext;
                                      let stepNumber = actualState.stepNumber;
                                      if( null === squares[el_index] ){
                                        squares[el_index] = actualState.xIsNext ? 'X' : 'O';
                                        xIsNext = !actualState.xIsNext;
                                        history = history.concat([{
                                          squares: squares,
                                        }]);
                                        stepNumber = history.length-1;
                                      }

                                      const winner = calculateWinner( squares );
                                      
                                      if( winner ){
                                        matchFinished = true;
                                      }else{
                                        matchFinished = false;
                                      }
                                      
                                      if( actualState.matchFinished !== matchFinished ){

                                        matchFinished = !actualState.matchFinished;

                                      }

                                      return { history: history, xIsNext: xIsNext, matchFinished: matchFinished, winner: winner, stepNumber: stepNumber, };
                                    }
                  );
  }

  generateInitialState(){
    return {
      history: [
        { squares: Array(9).fill(null), }
      ],
      xIsNext: true,
      matchFinished: false,
      winner: null,
      stepNumber: 0,
    };
  }
  
  jumpTo( index ) {
    this.setState({
      stepNumber: index,
      xIsNext: (index % 2) === 0,
    });
  }

  handleClickNewMatch(){
    const newLocal = this.generateInitialState();
    this.setState( newLocal );
  }

  render() {
    const new_game_message = 'New Match.';
    const history = this.state.history;
    const currentViewedStep = history[this.state.stepNumber];

    const moves = history.map((value, index) => {
      const desc = index ?
        'Go to move #' + index :
        'Go to game start';
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo( index )}>{desc}</button>
        </li>
      );
    });

    let status;
    const winner = this.state.winner;
    const xIsNext = this.state.xIsNext;
    if( winner ){
      status = 'T' === winner ? 'Tie.' : ('Winner: ' + winner + '.');
    }else{
      status = 'Next player: ' + ( xIsNext ? 'X' : 'O' );
    }

    return (
      <>
        <div className="game">
          <div className="game-board">
            <div className="status">{status}</div>
            <Board 
              handleClickSquare={this.handleClickSquare}
              squares={currentViewedStep.squares}
            />
          </div>
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
        </div>
        { this.state.matchFinished && 
        <div className="new-game-c">
          <button
            className="new-game"
            onClick={this.handleClickNewMatch}
          >
            {new_game_message}
          </button>
        </div> }
      </>
    );
  }
}

// ========================================

// X, O, T, null
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let tie = 1;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
    tie = tie && squares[a] && squares[b] && squares[c];  
  }
  
  return tie ? 'T' : null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


