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
  isOpen: boolean;
  showNumberKeypad: boolean;
  error: string | "";
};

class App extends Component<AppProps, AppState> {
  numberKeypad = {layout : [['7','8','9'],['4','5','6'],['1','2','3'],['\u2421' /* delete */,'0','\u23ce' /* enter */]]}
  doorKeypad = {layout : [['\u229A' /* circle */]]}

  constructor(props: AppProps) {
    super(props);
    this.state = {
      value: "",
      token: localStorage.getItem("jwt"),
      isOpen: false,
      showNumberKeypad: true,
      error: "",
    };
  }

  render() {
    return (<div className="App">
      {this.state.token == null ? (
        <div>
          <Screen screenText={this.state.value} />
          <Keypad config={this.numberKeypad} onKeypadClick={this.handleKeypadClick}/>
        </div>
        ) : 
        (
          <Keypad config={this.doorKeypad} onKeypadClick={this.handleKeypadClick}/>
        )
      }
      <div className="error" id="error">{this.state.error}</div>
    </div>)
  }

  handleKeypadClick: KeypadClickCallback = (buttonValue: string) => {
    switch (buttonValue) {
      case "\u23ce": // enter symbol
        this.checkCode();
        break;
      case "\u2421": // del symbol
        if (this.state.value.length > 0) {
          this.setState({value: this.state.value.substring(0, this.state.value.length - 1)});
        }
        break;
      case "\u229a": // circle symbol
        if (!this.state.token) {
          this.setState({error: "Token is null"})
        } else {
          this.toggleDoor(this.state.token);
        }
        break;
      default:
        if (this.state.value.length < 4) {
          const newState = this.state.value + buttonValue;
          this.setState({value: newState});
        }
    }
  }

  async checkCode() {
    const response = await fetch("/api/code", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password: this.state.value, email: "garage@birdhouse.com" }),
    });
    if (!response.ok) {
      this.setState({error: "Error checking code"});
      return;
    }
    const jwt = await response.json();
    localStorage.setItem("jwt", JSON.stringify(jwt));
    this.setState({token: JSON.stringify(jwt)});
    // show door opener buttons
    this.setState({showNumberKeypad: false});
  };

  async toggleDoor (jwt: string) {
    try {
      const response = await fetch("/api/toggle", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: jwt,
      });
      if (!response.ok) {
        // show keypad - hide opener button - show error
        this.setState({showNumberKeypad: true, error: "Error toggling door"});
        return;
      }
      await response.json();
    } catch (err) {
      // show error
      this.setState({showNumberKeypad: true, error: "Something bad happened"});
    }
    await this.isOpen(jwt);
  };

  async isOpen (jwt: string) {
    const response = await fetch("/api/isopen", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: jwt,
    });
    if (!response.ok) {
      // show error
      this.setState({showNumberKeypad: true, error: "Something bad happened"});
      return;
    }
    const doorStatus = await response.json();
    this.setState({isOpen: doorStatus.isOpen});
  }
}

export default App;
