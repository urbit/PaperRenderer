import React, { Component } from 'react'
import archiver from 'archiver'
import wallets from './sampleWallets/sampleWallet0.json'
import templates from '../../../lib/src/templates.json'

console.log(archiver)

import PaperRenderer from '../../../lib/dist/index.js'

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
    const duos = this.state.out

    // const files = [
    //   ['some-folder/cat.mp4', 'https://d8d913s460fub.cloudfront.net/videoserver/cat-test-video-320x240.mp4'],
    //   ['some-folder/status.txt', 'https://httpbin.org/get'],
    //   ['some-folder/teapot.txt', 'https://httpbin.org/status/418']
    // ].values()
    //
    // const files = duos.reduce((acc, duo) => {
    //
    //   const assets = duo.pages.map(page => {
    //     const fileName = `${duo.wallet.meta.patp}-${page.givenName}.png`
    //     return [fileName, page.image]
    //   })
    //
    //   acc = [...acc, assets]
    //   return acc
    //
    // }, [])
    // // Getting a iterator `.values()` is good for task where you
    // // have to iterate over values but can't use a for-loop, due to async nature
    //
    // new ZIP({
    //   // called each time when stream-zip has finish a entry
    //   pull (ctrl) {
    //     const entry = files.next()
    //     if (entry.done) {
    //       ctrl.close()
    //     } else {
    //       const [name, url] = entry.value
    //
    //       return fetch(url).then(res => {
    //         ctrl.enqueue({
    //           name,
    //           stream: () => res.body
    //         })
    //       })
    //     }
    //   }
    // }).pipeTo(streamSaver.createWriteStream('wallets.zip'))

    // const duos = this.state.out
    //
    // duos.forEach((duo) => {
    //
    //   const todl = duo.pages.map((page) => {
    //
    //     const fileName = `${duo.wallet.meta.patp}-${page.givenName}.png`
    //
    //     return [page.image, fileName, 'image/png']
    //
    //     // download(page.image, fileName, 'image/png')
    //
    //
    //     // const fileStream = streamSaver.createWriteStream(fileName, {
    //     //   size: 22, // (optional) Will show progress
    //     //   writableStrategy: undefined, // (optional)
    //     //   readableStrategy: undefined  // (optional)
    //     // })
    //     //
    //     // new Response(page.image).body
    //     //   .pipeTo(fileStream)
    //     //   .then(success, error)
    //
    //   })
    //
    //   download(todl)

    // })
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
        <div>
          <h3>Fonts</h3>
          <p>
            In order to test this, you must open font book and disable Inter,
            Inter UI and Source Code Pro or any fonts this library uses.
          </p>
          <p>Expected Fonts</p>
          <pre>{JSON.stringify(fontCount, null, ' ')}</pre>
          <button
            onClick={() => this.handleDownload()}
            disabled={disableDownload}
          >
            Download
          </button>
        </div>
        {
          <PaperRenderer
            debug={false}
            wallets={wallets}
            output="uri"
            callback={(data) => this.handleOutput(data)}
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
