import React, { Component } from 'react'
import wallets from './sampleWallets/sampleWallets.json'

import PaperCollateralRenderer from '../../../lib/dist/index.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      out: [],
    }
  }

  handleOutput = (data) => {
    this.setState({ out: data })
    console.log('Out: ', data)
  }

  render() {
    return (
      <div>
        <h4>Fonts</h4>
        <p>
          In order to test this, you must open font book and disable Inter,
          Inter UI and Source Code Pro or any fonts this library uses.
        </p>
        {
          <PaperCollateralRenderer
            wallets={wallets}
            className={''}
            callback={(data) => this.handleOutput(data)}
            // mode={'REGISTRATION'}
          />
        }
        {this.state.out.map((wallet) => {
          return wallet.imagePages.map((page) => {
            return (
              <img
                style={{
                  maxWidth: '550px',
                  height: 'auto',
                  border: '1px solid black',
                }}
                src={page.uri}
              />
            )
          })
        })}
      </div>
    )
  }
}

export default App
