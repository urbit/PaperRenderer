import React, { Component } from 'react'
import wallets from './sampleWallets/sampleWallet0.json'
import templates from '../../../lib/src/templates.json'

import PaperCollateralRenderer from '../../../lib/dist/index.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      out: [],
    }
  }

  handleOutput = (data) => {
    console.log(data)

    this.setState({ out: data })
    console.log('Out: ', data)
  }

  render() {
    const fontCount = templates.pages.reduce((acc, page) => {
      page.elements.forEach((elem) => {
        const key = `${elem.fontFamily}-${elem.fontWeight}`
        if (acc[key] === undefined) {
          acc[key] = 1
        } else {
          acc[key] = acc[key] + 1
        }
      })
      return acc
    }, {})

    // don't do this in prod code!
    delete fontCount['undefined-undefined']

    return (
      <div>
        <h3>Fonts</h3>
        <p>
          In order to test this, you must open font book and disable Inter,
          Inter UI and Source Code Pro or any fonts this library uses.
        </p>
        <p>Expected Fonts</p>
        <pre>{JSON.stringify(fontCount, null, ' ')}</pre>
        {
          <PaperCollateralRenderer
            show={false}
            debug={false}
            wallets={wallets}
            className={''}
            verbose={false}
            output={'uri'} // uri || png
            callback={(data) => this.handleOutput(data)}
            // mode={'REGISTRATION'}
          />
        }
        {this.state.out.map((wallet) => {
          return wallet.pages.map((page, idx) => {
            return (
              <img
                key={`page-${idx}`}
                style={{
                  maxWidth: '550px',
                  height: 'auto',
                }}
                src={page.image}
              />
            )
          })
        })}
      </div>
    )
  }
}

export default App
