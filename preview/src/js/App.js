import React, { Component } from 'react';
import wallet from './sampleWallets/wallet.json';

import PaperCollateralRenderer from '../../../lib/dist/index.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: [],
    };
  };


  handleOutput = data => {
    this.setState({pages: data})
    console.log('App.js scope: ', data)
  }


  render() {
    return (
      <div>
      <h4>Fonts</h4>
      <p>In order to test this, you must open font book and disable Inter, Inter UI and Source Code Pro or any fonts this library uses.</p>
        {
          <PaperCollateralRenderer
            wallet={wallet}
            className={''}
            callback={data => this.handleOutput(data)}
            // mode={'REGISTRATION'}
          />
        }

        {
          this.state.pages.map(p => {
            return <img style={{maxWidth:'550px', border:'1px solid black'}} src={p.durl} />
          })
        }
      </div>
    )
  }


}

export default App
