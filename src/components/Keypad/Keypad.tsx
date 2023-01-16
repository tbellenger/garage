import { Component, MouseEvent } from 'react';
import './Keypad.css';

export interface KeypadClickCallback {
  (buttonValue: string): void;
}

export interface KeypadData {
  layout : Array<Array<string>>;
}

class Keypad extends Component<{config: KeypadData, onKeypadClick : KeypadClickCallback},{}> {

  onClickHandler = (event: MouseEvent, id: string) => {
    event.preventDefault();
    this.props.onKeypadClick(id);
  };
  
  render() {
      return (
      <div className="keypad" id="code">
        {this.props.config.layout.map(row => (
          <div className="row">
            {row.map(button => (
              <button key={button} id={button} onClick={(e) => this.onClickHandler(e, e.currentTarget.id)}>
                {button}
              </button>))
            }
          </div>))
        }
      </div>);
  }
}

export default Keypad;