import React, { Component } from 'react';
import wallet1 from './sampleWallets/wallet1.json'; // walletX.value
import wallet2 from './sampleWallets/wallet2.json'; // walletX.value
import wallet3 from './sampleWallets/wallet3.json'; // walletX.value
import wallet4 from './sampleWallets/wallet4.json'; // walletX.value
import wallet5 from './sampleWallets/wallet5.json';

import PaperCollateralRenderer from './PaperCollateralRenderer';
import LayoutGenerator from './LayoutGenerator';

class App extends Component {
  render() {
    return (
      <div>
        <PaperCollateralRenderer
          wallet={wallet5}
          className={''}
          callback={data => console.log('App Scope: ', data)}
          mode={'REGISTRATION'}
        />
        {
          <LayoutGenerator />
        }
      </div>
    )
  }


}

export default App
