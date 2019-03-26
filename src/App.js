import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { EoswsClient, createEoswsSocket, InboundMessageType } from "@dfuse/eosws-js";
//import WebSocket from 'ws';

const endpoint = "mainnet.eos.dfuse.io"
const token = "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTYxNjM2MDIsImp0aSI6IjhlN2ZhNGVlLTc4ZjktNGM0MS05ZGM0LTA5YWVhOGI5MTY5NSIsImlhdCI6MTU1MzU3MTYwMiwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJDaVFBNmNieWU5MVMvYVBvRkJzSlREQTdXZkIvYU82SE84MXRGS1BKVU1zSnR1Wm9hV29TUFFBL0NMUnRmcG1XWVZFVFV1d3Z1aHltQTI5ZEVMbzNnVTFqZ0srcEgxTHNlOUE3MmQ4Z3ZYYnZBVnZhd09qdTYyV0hzM1BJMm1wWHA2WVlTRTg9IiwidGllciI6ImJldGEtdjEiLCJ2IjoxfQ.dH1T06AAeghCoMutlIeyADm1LFhLcYVNi4HpFndbohJwdXYYmar3hee-1VgWDlY9J4uFbabmZylgI2aUhM6L8Q";

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
