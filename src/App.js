import React, { Component } from 'react';
import sampleWallet from './lib/sampleWallet';
import PaperCollateralRenderer from './PaperCollateralRenderer';


class App extends Component {

  render() {
    return (
      <PaperCollateralRenderer
        wallet={sampleWallet}
        className={''}
        callback={data => console.log(data)}
      />
    )
  }


}

export default App
