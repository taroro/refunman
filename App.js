import React, {Component} from 'react';
import Routes from './app/Routes';



class App extends Component {
  constructor() {
    super();
    this.state = {};
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