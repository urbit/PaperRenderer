import React, { Component } from 'react';
// import wallet1 from './sampleWallets/wallet1.json'; // walletX.value
// import wallet2 from './sampleWallets/wallet2.json'; // walletX.value
// import wallet3 from './sampleWallets/wallet3.json'; // walletX.value
// import wallet4 from './sampleWallets/wallet4.json'; // walletX.value
import wallet5 from './sampleWallets/wallet5.json';

import PaperCollateralRenderer from './PaperCollateralRenderer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: [],
    };
  };


  handleOutput = data => {
    this.setState({pages: data})
    // console.log('App Scope: ', data)
  }


  render() {
    return (
      <div>
      hello
        {
          <PaperCollateralRenderer
            wallet={wallet5}
            className={''}
            callback={data => this.handleOutput(data)}
            mode={'REGISTRATION'}
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
