import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { EoswsClient, createEoswsSocket, InboundMessageType } from "@dfuse/eosws-js";
//import WebSocket from 'ws';

const endpoint = "mainnet.eos.dfuse.io"
const token = "yourkey";

const client = new EoswsClient(
  createEoswsSocket(() =>
    new WebSocket(`wss://${endpoint}/v1/stream?token=${token}`, { origin: "localhost:3000" })
  )
)


class App extends Component {
  componentDidMount() {
    console.log("component did mount")
    client
    .connect()
    .then(() => {
      client
        .getActionTraces({ account: "eosio.token", action_name: "transfer" })
        .onMessage((message) => {
          if (message.type === InboundMessageType.ACTION_TRACE) {
            const { from, to, quantity, memo } = message.data.trace.act.data
            console.log(from, to, quantity, memo)
          }
        })
    })
    .catch((error) => {
      console.log("Unable to connect to dfuse endpoint.", error)
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
