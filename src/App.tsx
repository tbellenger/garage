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
};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      value: "",
      token: localStorage.getItem('jwt'),
      isOpen: false,
    };
  }

  checkCode = async () => {
    const response = await fetch("/api/code", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password: this.state.value, email: "garage@birdhouse.com" }),
    });
    if (!response.ok) {
      // show error
      return;
    }
    const jwt = await response.json();
    localStorage.setItem("jwt", JSON.stringify(jwt));
    // show door opener buttons
    await this.isOpen(JSON.stringify(jwt));
  };

  toggleDoor = async (jwt: string) => {
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
        return;
      }
      await response.json();
    } catch (error) {
      // show error
    }
    await this.isOpen(jwt);
  };

  isOpen = async (jwt: string) => {
    const response = await fetch("/api/isopen", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: jwt,
    });
    if (!response.ok) {
      // show error
      return;
    }
    const doorStatus = await response.json();
    this.setState({isOpen:doorStatus.isOpen});
  }

  handleKeypadClick: KeypadClickCallback = (buttonValue: string) => {
    switch (buttonValue) {
      case "E":
        this.checkCode();
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
