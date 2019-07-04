import React, {Component} from 'react';
import Routes from './app/Routes';



class App extends Component {
  constructor() {
    super();
    this.state = {};
    global.refunManId = '2npz1Jm961SkAoP13PDS'
    //global.refunManId = 'qq8Ots5XZfoqYh4cRNcD'
  }

  async componentDidMount() {
  }
  
  render() {
    return (
      <Routes />
    );
  }
}

export default App;