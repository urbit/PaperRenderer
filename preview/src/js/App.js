import React, { Component } from 'react'
import JSZip from './vendor/jszip-browser'
// import saveAs from 'save-as'
import wallets from './sampleWallets/sampleWallets.json'
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
    this.setState({ out: data })
    console.log('Out: ', data)
  }

  handleDownload = () => {
    const wallets = this.state.out

    const zipPromises = wallets.map((wallet) => {
      const zip = new JSZip()

      wallet.pages.forEach((page) => {
        zip.file(`${page.givenName}`, page.image)
      })

      return zip.generateAsync({ type: 'blob' })
    })

    Promise.all(zipPromises).then((data, index) => {
      data.forEach((d) => saveAs(d, `${wallets[index].meta.patp}.zip`))
    })
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

    const disableDownload = this.state.out.length === 0

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
            debug={false}
            wallets={[wallets[0]]}
            className={''}
            callback={(data) => this.handleOutput(data)}
            // mode={'REGISTRATION'}
          />
        }
        <button
          onClick={() => this.handleDownload()}
          disabled={disableDownload}
        >
          Download
        </button>
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
