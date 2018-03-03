import React, {Component} from 'react';
import './App.css';
import './select.css';
import 'semantic-ui-css/semantic.min.css';
import {Input, Button} from 'semantic-ui-react';
import Select from 'react-select';
var jsonCats = require('./categories.json');

var options = [];

for (var i = 0; i < jsonCats.trivia_categories.length; i++) {
  let obj = {
    value: jsonCats.trivia_categories[i].id,
    label: jsonCats.trivia_categories[i].name
  };
  options.push(obj);
}

class App extends Component {

  constructor() {
    super();
    this.server = new WebSocket('ws://192.168.1.176:5000');
  }

  state = {
    response: '',
    name: '',
    playernumber: -1,
    correct: false,
    playercolor: 'black',
    ready: false,
    connected: false,
    category: "movies",
    categoryNumber: 0,
    myTurnToSelectDifficulty:false,
    myTurnToSelectAnAnswer:false
  };

  componentDidMount() {

    this.server.onopen = () => {
      this.setState({connected: true});
    };

    this.server.onmessage = (message) => {
      var msg = JSON.parse(message.data);
      switch (msg.type) {
        case "playerSetup":
          this.setState({playernumber: msg.playernumber, playercolor: msg.playercolor});
          break;
        case "YourTurnToSelectDifficulty":
          this.setState({myTurnToSelectDifficulty: true});
          break;
        case "YourTurnToSelectAnAnswer":
          this.setState({myTurnToSelectAnAnswer:true});
          break;
        default:
        return(null);
      }
    }
  }

  setCategory = (value) => {
    this.setState({category: value.label, categoryNumber: value.value});
    console.log(this.state.category);
  }

  submitName = () => {
    var msg = {
      type: 'setName',
      name: this.state.name
    }
    this.server.send(JSON.stringify(msg));
  }

  submitChoice = (choice) => {
    var msg = {
      type: choice,
      name: this.state.name,
    }
    this.server.send(JSON.stringify(msg));
    }

    submitChoiceAnswer = (choice) => {
      var msg = {
        type: choice,
        name: this.state.name,
      }
      this.server.send(JSON.stringify(msg));
      this.setState({myTurnToSelectAnAnswer:false})
      }


  signalReadytoAPI = () => {
    var msg = {
      type: 'signalReady',
      name: this.state.name,
      category: this.state.category,
      categoryNumber: this.state.categoryNumber
    };
    this.server.send(JSON.stringify(msg));
    this.setState({ready: true});
  }

  setName = (value) => {
    this.setState({name: value});
  };

  inputBar() {
    if (this.state.playernumber >= 0) {
      return (<div style={{
          flexGrow: 1,
          flexShrink: 1,
          fontSize: '300%',
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}>
        {this.state.name}
      </div>)
    } else {
      return (<div style={{
          flexGrow: 1,
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}>
        <b>WELCOME TO THE THUNDERDOOOOOOM-UH, Lets get to it</b>
        <br/>
        <Input placeholder='Enter Name Here' action = {<Button color = '#0bb6ff' onClick = {() => this.submitName()}>
        Go
        </Button>} onChange = {e => {this.setName(e.target.value)}}/>
      </div>)
    }
  }

  signalReady() {
    if (!this.state.ready && !(this.state.playercolor === 'black')) {
      return (<div>
        <br/>
        <Button color='grey' fluid='true' onClick={() => this.signalReadytoAPI()}>
          Ready to Play < /Button>
        </div>
        ) } } submitValue(value){}

        pickAnswers(){
          if (this.state.myTurnToSelectDifficulty) {
            return (<div>
              <br/>
              <Button color='red' fluid='true' onClick={() => {this.submitChoice("easy");
              this.setState({myTurnToSelectDifficulty:false, myTurnToSelectAnAnswer:true});}}>
                A - Easy
              </Button>
              <br/>
              <Button color='yellow' fluid='true' onClick={() => {this.submitChoice("medium");
              this.setState({myTurnToSelectDifficulty:false, myTurnToSelectAnAnswer:true});}}>
                B - Medium
              </Button>
              <br/>
              <Button color='blue' fluid='true' onClick={() => {this.submitChoice("hard");
              this.setState({myTurnToSelectDifficulty:false, myTurnToSelectAnAnswer:true});}}>
                C - Hard
              </Button>
            </div>)
          }

          if (this.state.myTurnToSelectAnAnswer) {
            return (<div>
              <br/>
              <Button color='#ff3100' fluid='true' onClick={() => this.submitChoiceAnswer("A")}>
                A
              </Button>
              <br/>
              <Button color='#0BB6FF' fluid='true' onClick={() => this.submitChoiceAnswer("B")}>
                B
              </Button>
              <br/>
              <Button color='#ff8700' fluid='true' onClick={() => this.submitChoiceAnswer("C")}>
                C
              </Button>
              <br/>
              <Button color='#00FF67' fluid='true' onClick={() => this.submitChoiceAnswer("D")}>
                D
              </Button>
              <br/>
            </div>)
          }
          if (!this.state.ready && !(this.state.playercolor === 'black')) {
            return (<div style={styles.container}>
              <div style={styles.selectbox}>
                Select Your Category
              </div>
              <div >
                <br/>
                <Select ref={(ref) => {
                    this.select = ref;
                  }} name="form-field-name" value={this.state.categoryNumber} options={options} onChange={this.setCategory}/>
              </div>
            </div>)
          }
        }

        render() {

          if (this.state.connected) {
            return (<div style={styles.container}>
              < div style={{
                  backgroundColor: this.state.playercolor,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '100%',
                  flexDirection: 'column',
                  font: 'white',
                  minHeight: '100%',
                  paddingBottom: '10%',
                  paddingTop: '10%'
                }}>
                {this.inputBar()}
              </div>
              {this.pickAnswers()}
              {this.signalReady()}
            </div>);
          } else {
            return (<div style={styles.container}>
              Connecting to the server
            </div>)
          }
        }
        } export default App; var styles = {
          container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
          },
          selectbox: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: "100%",
            width: '100%',
            height: '100%'
          },
          headerStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '100%',
            font: 'white',
            minHeight: '20%'
          }
        };
