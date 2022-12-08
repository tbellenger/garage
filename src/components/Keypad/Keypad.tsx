import { Component, MouseEvent } from 'react';
import './Keypad.css';

export interface KeypadClickCallback {
  (buttonValue: string): void;
}

class Keypad extends Component<{onKeypadClick : KeypadClickCallback},{}> {
  onClickHandler = (event: MouseEvent, id: string) => {
    event.preventDefault();
    this.props.onKeypadClick(id);
  };
  
  render() {
      return (
      <div className="keypad" id="code">
        <div className="row">
          <button id="7" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>7</button>
          <button id="8" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>8</button>
          <button id="9" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>9</button>
        </div>
        <div className="row">
          <button id="4" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>4</button>
          <button id="5" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>5</button>
          <button id="6" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>6</button>
        </div>
        <div className="row">
          <button id="1" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>1</button>
          <button id="2" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>2</button>
          <button id="3" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>3</button>
        </div>
        <div className="row">
          <button id="C" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>&#9249;</button>
          <button id="0" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>0</button>
          <button id="E" onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>&#9166;</button>
        </div>
      </div>
      );
  }
}

export default Keypad;