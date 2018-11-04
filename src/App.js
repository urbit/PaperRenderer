import React, { Component } from 'react';
import wallet1 from './lib/wallet1.json'; // walletX.value
import wallet2 from './lib/wallet2.json'; // walletX.value
import wallet3 from './lib/wallet3.json'; // walletX.value
import wallet4 from './lib/wallet4.json'; // walletX.value

import wallet5 from './lib/wallet5.json';

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
          mode={'CONVENTIONAL'}
        />
        {
          <LayoutGenerator />
        }
      </div>
    )
  }


}

export default App
