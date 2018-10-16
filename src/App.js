import React, { Component } from 'react';
import jsPDF from 'jspdf';
import ReactDOMServer from 'react-dom/server';
import domtoimage from 'dom-to-image';
import jsFileDownload from 'js-file-download';

import WalletRenderer from './WalletRenderer'
import figma from './lib/figma'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    figma.pull('a4u6jBsdTgiXcrDGW61q5ngY', res => {
      const layouts = res.document.children[0].children
      console.log(layouts)
    })
  }

  render() {
    const coldCustodyCopy = "This ticket is designed to be stored very securely and seldom accessed. Store cold in a paper or hardware wallet away from other seeds. Please see http://urbit.org/docs/custody for information on storing cryptographic material securely."
    const ownershipSeedDef = 'This ticket can be used to derive the Ownership seed, Transfer Proxy seed, Spawn Proxy seed, and Management seed using Bridge or urbit-wallet.js.'
    const usageA = 'Using this ticket with Bridge will allow you to perform any operation per the Constitution.'
    const usageB = "To sign transactions directly, derive the Ownership keypair from the the Ownership Seed following BIP32 at the derivation path /m/44’/60’/0’/0."
    const ownershipHardwareInfo = 'The BIP32 mnemonic is as good as the Master ticket, so if you want to migrate to a hardware or software BIP32 compatible wallet software, you can use the ownership address and safely discard the master ticket.'

    const renderables = [
      {
        type: 'masterTicket',
        custodyTier: 'cold',
        layout: 'seed',
        title: ['Master', 'Ticket'],
        patp: '~bilpur-divnel',
        ticket: ['~folfyl-lapdeb-lopmex-pagwyl','-lopmex-figbud-master-ryvmyl'],
        ticketSize: '128 bits',
        ownerSeedMnemonic: 'witch collapse practice feed shame open despair creek road again ice least',
        ownerSeedMnemonicSize: '128 bits',
        derivationPath: '/m/44’/60’/0’/0',
        ownershipAddress: '0x4E2AF4F618360b66307A0cfEd643f1F634d48eeF',
        dateCreated: '~2018.7.18..23.39.33',
        walletVersion: 'UP33',
        link: 'urbit.org/docs/custody',
        custodyParagraphs: [ coldCustodyCopy ],
        usageParagraphgs: [ ownershipSeedDef, usageA, usageB, ownershipHardwareInfo ],
      },
    ]

    return (
      <main id={'page-ref'}>
        {'Render a paper wallet'}
        <WalletRenderer renderables={renderables} />
      </main>
    )
  }
}
//
// class Page extends Component {
//   constructor(props) {
//     super(props)
//     this.pageRef = React.createRef();
//     this.state = {
//
//     }
//   }
//
//   render() {
//     return (
//       <div ref={this.pageRef}>{'Hello World'}</div>
//     )
//   }
//
// }

export default App
