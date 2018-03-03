import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Input, Button} from 'semantic-ui-react';
// import io from 'socket.io-client';
import socketIOClient from "socket.io-client";


class App extends Component {

  constructor () {
      super();
      this.server = socketIOClient('http://192.168.1.16:5000');
    }

  state = {
    endpoint:'http://192.168.1.16:3000',
    response: '',
    name: '',
    playerassigned: 0,
    correct:false,
    playercolor:'black',
    ready:false,
    connected:false
  };


componentDidMount(){
  // const server = socketIOClient('http://192.168.1.16:5000');

  this.server.on('connect', function() {
    this.setState({connected:true});
  }.bind(this));

   this.server.on('playerSetup', function(data) {
     console.log(data);

     this.setState({
       playerassigned: data.playerassigned,
       playercolor: data.playercolor});

     }.bind(this)
   );


}


    submitName = () => {
           this.server.emit('setName', this.state.name);
           }

      setName = (value) => {
           this.setState({name: value});
           };


  inputBar(){
    if (this.state.playerassigned > 0){
      return(
        <div style = {{flexGrow: 1, flexShrink: 1, fontSize: '300%', flexDirection: 'column', display: 'flex', alignItems: 'center', color:'white'}}>
          {this.state.name}
        </div>
        )} else {
            return(
              <div style = {{flexGrow: 1, flexShrink: 1, flexDirection: 'column', display: 'flex', alignItems: 'center', color:'white'}}>
                <b>WELCOME TO THE THUNDERDOOOOOOM-UH, Lets get to it</b>
                <br />
                <Input placeholder = 'Enter Name Here'
                action = {
                  <Button
                  color = 'teal'
                  onClick = {() => this.submitName()}>Go</Button>
                  }
                  onChange = { e => {this.setName(e.target.value)}}
                  />
              </div>
            )
          }
      }


  signalReadytoAPI = async () => {
    this.server.emit('ready', this.state.name);
    this.setState({ready: true});
  }


  signalReady(){
    if (!this.state.ready && !(this.state.playercolor==='black')){
      return(
        <div>
          <br />
          <Button color = 'grey'
                  fluid = 'true'
                  onClick = {() => this.signalReadytoAPI()}>
            Ready to Play
          < /Button>
        </div>
        )
      }
    }

  submitValue(value){

        }

  pickAnswers(){
    if (this.state.playerassigned > 0){
      return(
        <div>
          <br />
          <Button color = 'red'
                  fluid = 'true'
                  onClick = {() => this.submitValue("a")}>
              A
          </Button>
          <br />
          <Button color = 'blue'
                  fluid = 'true'
                  onClick = {() => this.submitValue("b")}>
              B
          </Button>
          <br />
          <Button color = 'yellow'
                  fluid = 'true'
                  onClick = {() => this.submitValue("c")}>
              C
          </Button>
          <br />
          <Button color = 'green'
                  fluid = 'true'
                      onClick = {() => this.submitValue("c")}>
              D
          </Button>
          <br />
        </div>
        )
      }
    }


render() {

      if (this.state.connected){
        return (
          <div style = {styles.container} >
            < div style = {{backgroundColor:this.state.playercolor, display: 'flex',
                  alignItems: 'center',
                  fontSize:'100%',
                  flexDirection: 'column',
                  font:'white',
                  minHeight:'20%',
                  paddingBottom: '10%',
                  paddingTop: '10%'}}  >
                {this.inputBar()}
            </div>
            {this.pickAnswers()}
            {this.signalReady()}
          </div>
        );
      }
  else {
      return(
        <div style = {styles.container}>
          Connecting to the server
        </div>
        )
      }
  }
}

export default App;

var styles = {
      container:
        {
        display: 'flex',
        flexDirection: 'column',
        width:'100%',
        height:'100%',
        },
      headerStyle:{
        display: 'flex',
        alignItems: 'center',
        fontSize:'100%',
        font:'white',
        minHeight:'20%'
        }
      };
