import React, { Component } from 'react';
import './App.css';
import Keypad, { KeypadClickCallback } from './components/Keypad/Keypad';
import Screen from './components/Screen/Screen';

type AppProps = {
  title?: string;
};

type AppState = {
  value: string | "";
  token: string | null;
};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      value: "",
      token: localStorage.getItem('jwt')
    };
  }

  async sendIt() {
    // do the send to server stuffm here
    const code = JSON.stringify({code:this.state.value});
    const response = await fetch('api', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: code
    });
    if (!response.ok) {
      // show error message
    } else {
      const {jwt} = await response.json();
      localStorage.setItem('jwt', JSON.stringify(jwt));
    }
  }

  handleKeypadClick: KeypadClickCallback = (buttonValue) => {
    switch (buttonValue) {
      case "E":
        this.sendIt();
        break;
      case "C":
        if (this.state.value.length > 0) {
          this.setState({value: this.state.value.substring(0, this.state.value.length - 1)});
        }
        break;
      default:
        if (this.state.value.length < 4) {
          const newState = this.state.value + buttonValue;
          this.setState({value: newState});
        }
    }
  }

  render() {
    return <div className="App">
      <Screen screenText={this.state.value} />
      <Keypad onKeypadClick={this.handleKeypadClick}/>
    </div>
  }
}

export default App;
