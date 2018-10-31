import React, { Component } from 'react';
import sampleWallet from './lib/sampleWallet';
import PaperCollateralRenderer from './PaperCollateralRenderer';
import LayoutGenerator from './LayoutGenerator';

class App extends Component {

  render() {
    return (
      <div>
        <PaperCollateralRenderer
          wallet={sampleWallet}
          className={''}
          callback={data => console.log('upperscope: ', data)}
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
